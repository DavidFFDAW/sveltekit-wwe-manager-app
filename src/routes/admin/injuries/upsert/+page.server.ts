import { InjuriesRepository } from "$lib/server/dao/repositories/injuries.repository";
import { WrestlerRepository } from "$lib/server/dao/repositories/wrestler.repository.js";

export const load = async ({ url }) => {
	const id = url.searchParams.get('id');
	const Injuries = new InjuriesRepository();
	const Wrestlers = new WrestlerRepository();

	const injury = id ? await Injuries.getById(id) : {};
	const wrestlers = await Wrestlers.getNonReleasedWrestlers();

	return {
		injury_upsert: {
			injury,
			wrestlers,
			param_id: id,
		}
	};
}