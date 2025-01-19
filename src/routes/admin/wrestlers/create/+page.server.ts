// import { Helpers } from '$lib/server/server.helpers';

import prisma from '$lib/server/prisma.js';
import { Helpers } from '$lib/server/server.helpers.js';

export const actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const created = await prisma.wrestler.create({
			data: {
				name: formData.get('name') as string,
				brand: formData.get('brand') as string,
				status: formData.get('status') as string,
				twitter_acc: formData.get('twitter_acc') as string,
				twitter_name: formData.get('twitter_name') as string,
				finisher: formData.get('finisher') as string,
				overall: parseInt(formData.get('overall') as string),
				sex: formData.get('gender') as string,
				kayfabe_status: formData.get('kayfabe') as string
			}
		});

		if (!created) return Helpers.error('Error al intentar crear luchador', 500);
		return Helpers.success('Luchador creado correctamente', 201);
	}
};
