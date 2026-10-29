import { rumble, wrestlers } from '$lib/server/dao/repositories';
import type { Rumble } from '@prisma/client';

export const load = async ({ params }) => {
	const { rumble_id } = params;
	const rumbleId = Number(rumble_id);
	const isUpdate = Boolean(rumbleId) && Number.isNaN(rumbleId) === false;

	const rumbleData = isUpdate
		? await rumble.getById(rumbleId)
		: {} as Rumble;

	const wrestlerList = await wrestlers.getNonReleasedWrestlers({
		select: { id: true, name: true, image_name: true, overall: true, sex: true }
	});

	return {
		isUpdate,
		id: rumbleId,
		rumble: rumbleData,
		wrestlers: wrestlerList.map(w => ({ ...w, image: w.image_name as string })),
		currentYear: new Date().getFullYear()
	};
}