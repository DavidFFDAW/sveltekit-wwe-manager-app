import { JWT } from '$lib/server/jwt.helper';
import { redirect, type Handle } from '@sveltejs/kit';
import type { UserLoginPayload } from './@types/UserLoginPayload';

const getUserFromPayloadToLocals = (payload: UserLoginPayload) => {
	return {
		uuid: payload.uuid,
		name: payload.name,
		role: payload.role,
		username: payload.username,
		email: payload.email
	};
};

export const handle: Handle = async ({ event, resolve }) => {
	const isAdminRequestedRoute = event.url.pathname.startsWith('/admin');
	const isLoginRequestedRoute = event.url.pathname.startsWith('/login');
	const sessionToken = event.cookies.get('session');
	const cookies = event.cookies.getAll();

	console.log('Hook middleware', {
		isAdminRequestedRoute,
		isLoginRequestedRoute,
		sessionToken,
		cookies
	});

	if (isLoginRequestedRoute) {
		if (!sessionToken) return resolve(event);
		const payload = JWT.verify(sessionToken) as UserLoginPayload;
		console.log('Hook middleware in login', {
			payload
		});

		if (!payload) {
			event.locals.user = undefined;
			event.cookies.delete('session', { path: '/' });
			return resolve(event);
		}
		event.locals.user = getUserFromPayloadToLocals(payload);
		throw redirect(301, '/admin');
	}

	if (!isAdminRequestedRoute) return resolve(event);

	if (isAdminRequestedRoute) {
		if (!sessionToken) throw redirect(303, '/login');
		const payload = JWT.verify(sessionToken);
		console.log('Hook middleware in admin', {
			payload
		});

		if (!payload) throw redirect(304, '/login');
		event.locals.user = getUserFromPayloadToLocals(payload as UserLoginPayload);

		return resolve(event);
	}

	return resolve(event);
};
