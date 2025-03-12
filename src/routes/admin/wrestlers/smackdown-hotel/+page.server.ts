import { WrestlerDao } from '$lib/server/dao/wrestler.dao.js';
import { Helpers } from '$lib/server/server.helpers.js';

export const load = async () => {
	return { wrestlers: await WrestlerDao.getWrestlers(), required: WrestlerDao.required };
};

export const actions = {
	importWrestlers: async ({ request, locals }) => {
		if (!Helpers.hasPermission(locals))
			return Helpers.error('No tienes permisos para realizar esta acción');

		try {
			const datas = await request.formData();
			const names = datas.getAll('wrestler[name][]');
			const overalls = datas.getAll('wrestler[overall][]');
			const brands = datas.getAll('wrestler[label][]');
			const finishers = datas.getAll('wrestler[finisher][]');
			const statuses = datas.getAll('wrestler[status][]');
			const genders = datas.getAll('wrestler[gender][]');

			const uploadingWrestlers = names.map((name, index) => {
				const slug = Helpers.slugify(name as string);
				return {
					name: name as string,
					overall: Number(overalls[index]),
					brand: (brands[index] || 'raw') as string,
					finisher: finishers[index] as string,
					status: statuses[index] as string,
					slug: slug,
					twitter_acc: `@${slug}`,
					twitter_name: name as string,
					sex: genders[index] as string
				};
			});

			const created = await WrestlerDao.createMany(uploadingWrestlers);
			if (!created) return Helpers.error('No se ha podido importar los luchadores');
			return Helpers.success('Luchadores importados correctamente');
		} catch (error) {
			console.error(error);
			return Helpers.error('Ha ocurrido un error al importar los luchadores');
		}
	}
};
