import { WrestlerDao } from '$lib/server/dao/wrestler.dao';
import { Helpers } from '$lib/server/server.helpers.js';
import { ImageUploadService } from '$lib/server/services/image-upload-service.js';
import fs from 'fs';

export const actions = {
	default: async ({ request, locals }) => {
		if (!Helpers.hasPermission(locals)) return Helpers.error('Unauthorized', 401);
		const formData = await request.formData();
		const { error, message } = Helpers.checkRequiredFields(formData, WrestlerDao.required);
		if (error) return Helpers.error(message);

		const objet = Object.fromEntries(formData.entries());
		fs.writeFileSync(
			'./src/routes/admin/wrestlers/create/test.json',
			JSON.stringify(objet, null, 4),
			'utf-8'
		);

		const wrestlerObject = WrestlerDao.transformToWrestlerObject(formData);
		const slugifiedName = Helpers.slugify(wrestlerObject.name);
		try {
			const updatedWrestler = await WrestlerDao.createWrestler(wrestlerObject);

			if (Helpers.dataHas(formData, 'wrestler-image-upload')) {
				const imageURL = await ImageUploadService.uploadImageFromDataURL(
					formData.get('wrestler-image-upload') as string,
					slugifiedName,
					locals.user?.api_token as string
				);

				await WrestlerDao.updateImage(imageURL, updatedWrestler.id);
			}

			if (updatedWrestler) return Helpers.success('Luchador creado correctamente');
		} catch (error: unknown) {
			console.log(typeof error);
			if (error instanceof Error) return Helpers.error(`Error:: ${error.message}`, 500);
		}
		return Helpers.error('No implementado');
	}
};
