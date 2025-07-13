import { ReignsDao } from '$lib/server/dao/reigns.dao';
import { Helpers } from '$lib/server/server.helpers.js';
import DateUtils from '$lib/utils/date.utils.js';

export const load = async ({ locals }) => {
	if (!Helpers.hasPermission(locals)) throw Helpers.redirection('/');

	const championshipReigns = await ReignsDao.getChampionshipReignsOrderedWithTeamNames({
		won_date: 'asc'
	});

	const groupedByChampionship = championshipReigns.reduce(
		(acc: Record<number, (typeof reign)[]>, reign) => {
			const championshipId = reign.Championship.id;
			if (!acc[championshipId]) {
				acc[championshipId] = [];
			}
			acc[championshipId].push(reign);
			return acc;
		},
		{}
	);

	return {
		reigns: Object.entries(groupedByChampionship),
		championships: Object.values(groupedByChampionship).map((reigns) => reigns[0].Championship)
	};
};

export const actions = {
	default: async ({ request, locals }) => {
		if (!Helpers.hasPermission(locals)) throw Helpers.redirection('/admin');
		const formData = await request.formData();

		try {
			const updateID = Helpers.getUpdateID(formData);
			if (!updateID || isNaN(updateID)) return Helpers.error('ID de actualización no válido.', 400);

			const { error, message } = Helpers.checkRequiredFields(formData, [
				'won_date',
				'lost_date',
				'defences',
				'victory_way',
				'ppv_won'
			]);
			if (error) return Helpers.error(message, 400);

			const reignExists = await ReignsDao.reignExists(updateID);
			if (!reignExists) return Helpers.error('El reinado no existe.', 404);

			const wonDate = new Date(formData.get('won_date') as string);
			if (!wonDate || isNaN(wonDate.getTime()))
				return Helpers.error('Fecha de inicio no válida.', 400);

			const lostDate = formData.get('lost_date')
				? new Date(formData.get('lost_date') as string)
				: null;

			if (lostDate && lostDate < wonDate)
				return Helpers.error(
					'La fecha de pérdida no puede ser anterior a la fecha de inicio.',
					400
				);

			const defences = formData.get('defences') ? Number(formData.get('defences')) : 0;
			if (isNaN(defences)) return Helpers.error('Número de defensas no válido.', 400);
			const days = DateUtils.getDaysBetweenDates(wonDate, lostDate || new Date());

			const updated = await ReignsDao.updateChampionshipReign(updateID, {
				won_date: wonDate,
				lost_date: lostDate,
				days,
				defences,
				victory_way: (formData.get('victory_way') as string) || null,
				ppv_won: (formData.get('ppv_won') as string) || null
			});
			if (!updated) return Helpers.error('No se pudo actualizar el reinado.', 500);
			return Helpers.success('Reinado actualizado correctamente.', 200);
		} catch (error) {
			console.error('Error al procesar el formulario:', error);
			return Helpers.error('Error al procesar el formulario.', 500);
		}
	}
};
