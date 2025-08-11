import { Helpers } from '$lib/server/server.helpers.js';

export const actions = {
	default: async ({ request }) => {
		const datas = await request.formData();
		const isTag = Helpers.getToggleInput(datas, 'tag_team');

		for (const [key, value] of datas.entries()) {
			console.log(`${key}:  ${value}`);
		}
		console.log(`isTag: ${isTag}`);

		return { success: true, message: 'Championship updated successfully' };
	}
};
