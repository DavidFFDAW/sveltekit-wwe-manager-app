import EmailService from "$lib/server/services/email.server.service";

export const GET = async () => {
	try {
		return new Response('Prueba de correos finalizada', { status: 200 });
	} catch (e: unknown) {
		if (e instanceof Error)
			return new Response(e.message, { status: 500 });
		return new Response('Ha ocurrido un error inesperado', { status: 500 });
	}
};