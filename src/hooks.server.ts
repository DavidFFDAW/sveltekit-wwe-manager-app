import { JWT } from '$lib/server/jwt.helper';
import { redirect, type Handle } from '@sveltejs/kit';
import type { UserLoginPayload } from './@types/UserLoginPayload';

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

export const handle: Handle = async ({ event, resolve }) => {
	const sessionToken = event.cookies.get('session') || '';

	const isTokenValid = JWT.verify(sessionToken) as UserLoginPayload;
	if (isTokenValid) {
		event.locals.user = getUserFromPayloadToLocals(isTokenValid);
	}

	const hasUser = Boolean(event.locals.user?.uuid);

	const isAdmin = event.url.pathname === '/admin';
	if (!isAdmin && event.url.pathname.startsWith('/admin')) {
		if (!hasUser) {
			throw redirect(302, `/login?next=${event.url.pathname}`);
		}
	}

	const response = await resolve(event);
	response.headers.set(
		'cache-control',
		'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0'
	);
	return response;
};
