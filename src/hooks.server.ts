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
    };
};

export const handle: Handle = async ({ event, resolve }) => {
    const isAdminRequestedRoute = event.url.pathname.startsWith('/admin');
    const isLoginRequestedRoute = event.url.pathname.startsWith('/login');
    const sessionToken = event.cookies.get('session');

    if (isLoginRequestedRoute) {
        if (!sessionToken) return await resolve(event);
        const payload = JWT.verify(sessionToken) as UserLoginPayload;
        if (!payload) {
            event.locals.user = undefined;
            event.cookies.delete('session', { path: '/' });
            return await resolve(event);
        }
        event.locals.user = getUserFromPayloadToLocals(payload);
        throw redirect(302, '/admin');
    }

    if (!isAdminRequestedRoute) return await resolve(event);

    if (isAdminRequestedRoute) {
        if (!sessionToken) throw redirect(302, '/login');
        const payload = JWT.verify(sessionToken) as UserLoginPayload;
        if (!payload) throw redirect(302, '/login');

        event.locals.user = getUserFromPayloadToLocals(payload as UserLoginPayload);
        return await resolve(event);
    }

    return await resolve(event);
};
