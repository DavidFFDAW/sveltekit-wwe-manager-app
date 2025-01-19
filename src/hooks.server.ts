import { type Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const isAdminRequestedRoute = event.url.pathname.startsWith('/admin');
	if (!isAdminRequestedRoute) resolve(event);

	if (isAdminRequestedRoute) {
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
