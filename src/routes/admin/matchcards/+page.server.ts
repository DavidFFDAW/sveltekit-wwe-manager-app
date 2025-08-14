import { PpvCardRepository } from '$lib/server/dao/repositories/matchcard.repository.js';

export const load = async () => {
	const ppvCardRepository = new PpvCardRepository();
	const matchcards = await ppvCardRepository.get();
	return { matchcards };
};
