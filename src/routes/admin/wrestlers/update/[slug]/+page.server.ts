import { WrestlerDao } from '$lib/server/dao/wrestler.dao.js';
import { Helpers } from '$lib/server/server.helpers.js';
import { ImageUploadService } from '$lib/server/services/image-upload-service';
import { redirect } from '@sveltejs/kit';

export const load = async ({ params }) => {
	const { slug } = params;
	if (!slug) throw redirect(302, '/admin/wrestlers');

	const wrestler = isNaN(Number(slug))
		? await WrestlerDao.getWrestlerBySlug(slug)
		: await WrestlerDao.getWrestlerById(Number(slug));

	return { wrestler, slug };
};

export const actions = {
	update: async ({ request, locals }) => {
		const datas = await request.formData();
		const updatingID = Number(datas.get('_update_id'));
		if (!updatingID) return Helpers.error('No se ha encontrado el luchador a actualizar');

		const { error, message } = Helpers.checkRequiredFields(datas, WrestlerDao.required);
		if (error) return Helpers.error(message);

		const wrestlerObject = WrestlerDao.transformToWrestlerObject(datas);
		try {
			const updatedWrestler = await WrestlerDao.updateWrestler(wrestlerObject, updatingID);

			if (Helpers.dataHas(datas, 'wrestler-image-upload')) {
				const imageURL = await ImageUploadService.uploadImageFromDataURL(
					datas.get('wrestler-image-upload') as string,
					Helpers.slugify(wrestlerObject.name),
					locals.user?.api_token as string
				);
				await WrestlerDao.updateImage(imageURL, updatingID);
			}

			if (updatedWrestler) return Helpers.success('Luchador actualizado correctamente');
		} catch (error: unknown) {
			console.log(typeof error);
			if (error instanceof Error) return Helpers.error(`Error:: ${error.message}`, 500);
		}
	}
};
