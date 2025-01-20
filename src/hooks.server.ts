import { JWT } from '$lib/server/jwt.helper';
import { redirect, type Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const isAdminRequestedRoute = event.url.pathname.startsWith('/admin');
	const isLoginRequestedRoute = event.url.pathname.startsWith('/login');
	const sessionToken = event.cookies.get('session');
	if (!isAdminRequestedRoute) resolve(event);

	if (isLoginRequestedRoute) {
		if (!sessionToken) return resolve(event);
		const payload = JWT.verify(sessionToken);
		if (!payload) return resolve(event);
	}

	if (isAdminRequestedRoute) {
		const sessionToken = event.cookies.get('session');
		if (!sessionToken) throw redirect(302, '/login');

		event.locals.user = {
			uuid: 45,
			name: 'admin',
			role: 'admin',
			username: 'admin',
			email: 'test'
		};
		console.log('Check for user authentication');
		return resolve(event);
	}

	return resolve(event);
};
