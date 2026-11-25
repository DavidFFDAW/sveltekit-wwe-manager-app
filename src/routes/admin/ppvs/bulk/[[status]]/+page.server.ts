import { ppv } from '$lib/server/dao/repositories/ppv.repository.js';
import { Helpers } from '$lib/server/server.helpers';
import FormService from '$lib/services/form.service';

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
		const formData = await FormService.fromRequest(request);
		const ppvIds = formData.getAll('ppvs[]');

		const ppvs = ppvIds.map(id => {
			const timestamp = formData.get(`ppvs[${id}][date]`) + 'T20:00:00Z';
			const date = formData.getDate(timestamp);
			return {
				id,
				name: formData.get(`ppvs[${id}][name]`),
				annual_order: formData.get(`ppvs[${id}][annual_order]`),
				abbreviation: formData.get(`ppvs[${id}][abbreviation]`),
				dateValue: formData.get(`ppvs[${id}][date]`),
				realDateIso: date.getCustomIsoFormat(true),
				realDate: date,
			}
		});

		console.log({
			ppvs: ppvs,
		});

		return Helpers.error('Bulk update not implemented yet');
	}
}