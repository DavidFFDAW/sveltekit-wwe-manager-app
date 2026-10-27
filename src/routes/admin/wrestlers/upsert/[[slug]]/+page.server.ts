import FormService from '$lib/services/form.service';
import type { Prisma, Wrestler } from '@prisma/client';
import { Helpers } from '$lib/server/server.helpers.js';
import { wrestlers } from '$lib/server/dao/repositories/wrestler.repository.js';

export const load = async ({ params }) => {
	const { slug } = params;

	const wrestler = Boolean(slug) && slug !== ''
		? await wrestlers.getBySlugOrId(slug as string)
		: {} as Wrestler

	return { wrestler, slug, isUpdate: Boolean(slug) };
};

export const actions = {
	upsert: async ({ request }) => {
		try {
			const datas = await FormService.fromRequest(request);
			const updateId = datas.getUpdateId();
			const isUpdate = Boolean(updateId);

			const { error, message } = datas.checkRequiredFields(['name', 'overall', 'gender', 'status', 'brand']);
			if (error) return Helpers.error(message);

			const wrestlerName = datas.get('name');
			const wrestlerSlug = Helpers.slugify(wrestlerName);

			const wrestlerObject: Prisma.WrestlerCreateInput = {
				name: wrestlerName,
				slug: wrestlerSlug,
				alias: datas.getOrNull('alias'),
				finisher: datas.get('finisher'),
				overall: datas.getNumber('overall'),
				sex: datas.get('gender'),
				kayfabe_status: datas.getOrNull('kayfabe_status'),
				status: datas.get('status'),
				brand: datas.get('brand'),
				is_tag: datas.getToggle('is_tag'),
				is_champ: datas.getToggle('is_champ'),
				twitter_acc: wrestlerName.replace(/\s+/g, '_').toLowerCase() + '_wwe',
				twitter_name: wrestlerName + ' WWE',
				image_name: datas.get('image') as string,
				twitter_image: datas.get('image') as string,
				categories: datas.getAll('categories').join(',')
			};

			console.log({ data: datas.entries(), wrestlerObject, updateId });

			const databaseOperation = isUpdate
				? wrestlers.updateById(updateId, wrestlerObject)
				: wrestlers.create(wrestlerObject)
			const upsertedWrestler = await databaseOperation;

			if (!upsertedWrestler || !upsertedWrestler.id)
				return Helpers.error(
					isUpdate ? 'Error al actualizar el luchador' : 'Error al crear el luchador'
				);

			return Helpers.success(upsertedWrestler.name + ` ${isUpdate ? `actualizado correctamente` : 'creado correctamente'}`);

			// if (Helpers.dataHas(datas, 'wrestler-image-upload')) {
			// 	const imageURL = await ImageUploadService.uploadImageFromDataURL(
			// 		datas.get('wrestler-image-upload') as string,
			// 		Helpers.slugify(wrestlerObject.name),
			// 		locals.user?.api_token as string
			// 	);
			// 	await WrestlerDao.updateImage(imageURL, updatingID);
			// }
		} catch (error: unknown) {
			console.log(typeof error);
			if (error instanceof Error) return Helpers.error(`Error:: ${error.message}`, 500);
		}
	}
};