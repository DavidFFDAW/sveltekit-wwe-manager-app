import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	// console.log('Comprobando la sesión para: ', event.request.url);
	
  // Obtener la cookie de sesión
//   const sessionCookie = event.cookies.get('session');

  // Comprobar si la sesión es válida
//   if (sessionCookie) {
//     const user = await getSessionFromCookie(sessionCookie);
//     if (user) {
//       // Añadir el usuario al contexto local
//       event.locals.user = user;
//     }
//   }

  // Continuar con la resolución de la solicitud
  return resolve(event);
};