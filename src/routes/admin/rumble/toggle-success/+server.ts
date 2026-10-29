import { rumble } from '$lib/server/dao/repositories';
import { Api, Helpers } from '$lib/server/server.helpers';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ url, locals }) => {
	const hasPermission = Helpers.hasPermission(locals);
	console.log({ hasPermission });

	if (!hasPermission)
		return Api.error('Permission denied');

	const rumbleParam = url.searchParams.get('id') as string;
	if (!rumbleParam) return Api.error('Rumble ID is required');

	const rumbleID = Number(rumbleParam);
	if (isNaN(rumbleID)) return Api.error('Invalid Rumble ID');

	try {
		const current = await rumble.getById(rumbleID);
		if (!current) return Api.error('Rumble not found');

		const updated = await rumble.updateById(rumbleID, { successful: !current.successful });
		if (!updated) return Api.error('Failed to update rumble');
		return Api.success('Rumble updated successfully');

	} catch (error) {
		console.error('Error toggling rumble success for ID:', rumbleID, error);
		return Api.error('An error occurred');
	}
};