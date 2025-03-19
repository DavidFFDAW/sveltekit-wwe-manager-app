import { JWT } from '$lib/server/jwt.helper';
import { json, redirect, type Handle } from '@sveltejs/kit';
import type { UserLoginPayload } from './@types/UserLoginPayload';
import { COOKIE_NAME } from '$lib/constants/app';
import { UsersDao } from '$lib/server/dao/users.dao';

const getUserFromPayloadToLocals = (payload: UserLoginPayload) => {
	return {
		uuid: payload.uuid,
		name: payload.name,
		role: payload.role,
		username: payload.username,
		email: payload.email,
		api_token: payload.token
	};
};

const handleApiRoute: Handle = async ({ event, resolve }) => {
	const headers = event.request.headers;
	const sessionToken = headers.get('authorization') || event.cookies.get(COOKIE_NAME) || '';
	const unauthorized = json({ message: 'Unauthorized' }, { status: 401 });

	const isTokenValid = JWT.verify(sessionToken) as UserLoginPayload;
	if (isTokenValid) {
		event.locals.user = getUserFromPayloadToLocals(isTokenValid);
	}

	const hasUser = Boolean(event.locals.user?.uuid);
	const userRole = event.locals.user?.role;

	if (!hasUser) return unauthorized;
	if (!userRole) return unauthorized;
	if (!['admin', 'superadmin'].includes(userRole)) return unauthorized;

	const response = await resolve(event);
	response.headers.set('content-type', 'application/json; charset=utf-8');

	return response;
};

export const handle: Handle = async (handleParams) => {
	const { event, resolve } = handleParams;
	const isApiRequestedRoute =
		event.url.pathname === '/api' || event.url.pathname.startsWith('/api');

	if (isApiRequestedRoute) return handleApiRoute(handleParams);

	const sessionToken = event.cookies.get(COOKIE_NAME) || '';
	const lastConnectionLogged = event.cookies.get('last_connection_logged');

	const isTokenValid = JWT.verify(sessionToken) as UserLoginPayload;
	if (isTokenValid) {
		event.locals.user = getUserFromPayloadToLocals(isTokenValid);
	}

	if (event.locals.user?.uuid && !lastConnectionLogged) {
		try {
			await UsersDao.updateLastConnectionDate(event.locals.user.uuid);
			event.cookies.set('last_connection_logged', 'true', {
				path: '/',
				httpOnly: true,
				sameSite: 'strict',
				maxAge: 60 * 60 * 24 // Opcionalmente para un día completo
			});
		} catch (error) {
			console.error('Error al actualizar la fecha de última conexión', error);
		}
	}

	const hasUser = Boolean(event.locals.user?.uuid);
	const userRole = event.locals.user?.role;
	const isAdminRequestedRoute =
		event.url.pathname === '/admin' || event.url.pathname.startsWith('/admin');

	if (isAdminRequestedRoute) {
		if (!hasUser) {
			throw redirect(302, `/login?next=${event.url.pathname}`);
		}
		if (!userRole) throw redirect(302, '/');

		if (!['admin', 'superadmin'].includes(userRole)) {
			throw redirect(302, '/');
		}
	}

	if (isApiRequestedRoute) {
		const unauthorized = json({ message: 'Unauthorized' }, { status: 401 });
		if (!hasUser) return unauthorized;
		if (!userRole) return unauthorized;
		if (!['admin', 'superadmin'].includes(userRole)) return unauthorized;
	}

	const response = await resolve(event);
	response.headers.set(
		'cache-control',
		'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0'
	);
	return response;
};
