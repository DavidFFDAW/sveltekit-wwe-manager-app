import { ppv } from '$lib/server/dao/repositories';
import { Helpers } from '$lib/server/server.helpers';
import type { PPV } from '@prisma/client';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async () => {
	try {
		const currentYear = new Date().getFullYear();
		const nextYear = currentYear + 1;
		const ppvs = await ppv.get({
			select: {
				id: true,
				name: true,
				game_date: true
			},
			where: {
				active: true,
			},
			orderBy: {
				game_date: 'asc'
			}
		})
		const ppvsWithDate = ppvs.filter(ppv => Boolean(ppv.game_date)) as (PPV & { game_date: Date })[];

		const firstPpv = ppvsWithDate[0];
		if (firstPpv.game_date.getFullYear() === nextYear)
			return Helpers.api.error('PPV for next year already exists', 400);

		for (const ppv of ppvsWithDate) {
			ppv.game_date.setFullYear(nextYear);
			const day = ppv.game_date.getDay();

			const diff = (7 - day) % 7;
			ppv.game_date.setDate(ppv.game_date.getDate() + diff);
		}

		const promises = ppvsWithDate.map(pv => ppv.updateById(pv.id, {
			game_date: pv.game_date
		}));

		await Promise.all(promises);
		return Helpers.api.success('PPV dates updated successfully');
	} catch (error) {
		console.error(error);
		return Helpers.api.error('An error occurred while updating PPV dates', 500);
	}
};