import { type Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
    console.log('checking...');
    console.log('url: ', event.url.pathname);
    console.log('requested route: ', event.request.url);

    const isAdminRequestedRoute = event.url.pathname.startsWith('/admin');
    if (!isAdminRequestedRoute) resolve(event);

    if (isAdminRequestedRoute) {
        event.locals.user = { uuid: 45, name: 'admin', role: 'admin', username: 'admin', email: 'test' };
        console.log('Check for user authentication');
        return resolve(event);
    }

    return resolve(event);
};
