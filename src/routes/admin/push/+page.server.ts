import { Helpers } from '$lib/server/server.helpers';

export const actions = {
	default: async ({ request, locals, fetch }) => {
		if (!Helpers.hasPermission(locals)) return Helpers.error('No tienes permisos para hacer esto.');

		const datas = await request.formData();
		const { error, message } = Helpers.checkRequiredFields(datas, ['title', 'image', 'url']);
		if (error) return Helpers.error(message, 400);

		try {
			const response = await fetch('/api/push/send', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					title: datas.get('title'),
					body: datas.get('body'),
					url: datas.get('url'),
					image: datas.get('image')
				})
			});

			if (!response.ok) return Helpers.error('Error al enviar el push', response.status);
			return Helpers.success('Push enviado correctamente', 200);
		} catch (e: unknown) {
			console.log(e);
			if (e instanceof Error) return Helpers.error(`Error: ${e.message}`, 500);
		}
	}
};
