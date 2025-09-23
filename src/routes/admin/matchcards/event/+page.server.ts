import { PpvCardRepository } from '$lib/server/dao/repositories/matchcard.repository.js';
import { Helpers } from '$lib/server/server.helpers.js';
import { Utils } from '$lib/utils/general.utils.js';
import { PPVRepository } from '$lib/server/dao/repositories/ppv.repository.js';

export const load = async ({ url }) => {
	const ppvRepository = new PPVRepository();
	const ppvs = await ppvRepository.get({
		select: {
			name: true
		}
	});

	const hasSlug = url.searchParams.has('slug');
	if (!hasSlug)
		return {
			event_card: { isUpdate: hasSlug, event: null, ppvs }
		};

	const slug = url.searchParams.get('slug') as string;
	const matchCardRepository = new PpvCardRepository();
	const matchCardEvent = await matchCardRepository.getRow({
		where: { id: Number(slug) },
		include: {
			matches: true
		}
	});

	if (!matchCardEvent)
		return {
			event_card: { isUpdate: hasSlug, event: null, ppvs }
		};

	return {
		event_card: {
			isUpdate: true,
			event: matchCardEvent,
			slug: slug,
			ppvs: ppvs
		}
	};
};

export const actions = {
	default: async ({ request }) => {
		const formData = await request.formData();

		try {
			const action = Helpers.getAction(formData);
			const updateId = Helpers.getUpdateID(formData);
			const matchCardRepository = new PpvCardRepository();
			for (const [key, value] of formData.entries()) {
				console.log(`Key: ${key}, Value: ${value}`);
			}
			const ppv_date = formData.get('ppv_date_done') as string;
			const ppvRealDate = Utils.getUTCDate(ppv_date);

			const datas = {
				ppv_name: formData.get('ppv_name') as string,
				ppv_image: formData.get('ppv_image') as string,
				ppv_date: ppvRealDate
			};

			console.log('Datas to be saved:', datas);

			if (action === 'create') {
				await matchCardRepository.create(datas);
			}
			if (action === 'update' && updateId) {
				await matchCardRepository.updateById(updateId, datas);
			}
		} catch (error) {
			console.error('Error creating/updating match card:', error);
			return Helpers.error('Failed to create or update match card');
		}
	}
};
