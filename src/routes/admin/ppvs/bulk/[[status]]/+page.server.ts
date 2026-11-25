import { ppv } from '$lib/server/dao/repositories/ppv.repository.js';
import { Helpers } from '$lib/server/server.helpers';
import FormService from '$lib/services/form.service';
import type { Prisma } from '@prisma/client';

export const load = async ({ params }) => {
	const status = params.status ? params.status : 'active';
	const isActive = status ? status === 'active' : false;

	const list = await ppv.get({
		where: { active: isActive },
		orderBy: { annual_order: 'asc' }
	});

	return { ppvs: list };
}

export const actions = {
	bulk_update: async ({ request }) => {
		try {
			const formData = await FormService.fromRequest(request);
			const ppvIds = formData.getAll('ppvs[]');

			const updateList: { id: number, update: Prisma.PPVUpdateInput }[] = ppvIds.map(id => {
				const timestamp = formData.get(`ppvs[${id}][date]`) + 'T20:00:00';
				const date = new Date(timestamp);
				const order = ppv.getAnnualOrder(date);

				return {
					id: Number(id),
					update: {
						name: formData.get(`ppvs[${id}][name]`),
						abbreviation: formData.get(`ppvs[${id}][abbreviation]`),
						annual_order: order,
						game_date: date,
					},
				}
			});

			const results = await Promise.all(
				updateList.map(({ id, update }) => ppv.updateById(
					id,
					update
				))
			);

			const successCount = results.filter(r => r).length;
			if (successCount === 0) return Helpers.error('No PPVs were updated');
			return Helpers.success(`${successCount} PPVs updated successfully`);
		} catch (error) {
			console.error(error);
			return Helpers.error('An error occurred during bulk update');
		}
	}
}