import { COOKIE_NAME } from '$lib/constants/app.js';
import { Helpers } from '$lib/server/server.helpers.js';

export function POST({ cookies, locals }) {
    if (!locals.user) return Helpers.apiResponse({ message: 'No es posible hacer esto' }, 401);
    cookies.delete(COOKIE_NAME, { path: '/' });
    return Helpers.apiResponse({ message: 'Sesión cerrada correctamente' });
}
