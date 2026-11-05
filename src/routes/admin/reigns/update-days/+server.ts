import { reigns } from "$lib/server/dao/repositories"

export const POST = async () => {
	const affected = await reigns.updateDaysOfNonCurrentReigns();
	const currentAffected = await reigns.executeCurrentReignsCronJob();
	const totalAffected = affected + currentAffected;

	return new Response(JSON.stringify({ totalAffected }), {
		headers: { 'Content-Type': 'application/json' }
	});
}