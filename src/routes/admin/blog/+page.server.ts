import { BlogDao } from '$lib/server/dao/blog.dao';
import { Helpers } from '$lib/server/server.helpers';

export const load = async ({ locals }) => {
	if (!locals.user) throw Helpers.redirection('/admin/dashboard');
	return {
		posts: await BlogDao.getOrderedPosts()
	};
};

export const actions = {
	toggleVisibility: async ({ request, locals }) => {
		if (!Helpers.hasPermission(locals)) return Helpers.error('Permission denied');
		const datas = await request.formData();
		const updatingID = Helpers.getUpdateID(datas);
		if (!updatingID) return Helpers.error('ID not found');

		const post = await BlogDao.getPostById(updatingID);
		if (!post) return Helpers.error('Post not found');

		await BlogDao.updatePublish(updatingID, !post.visible);
		return Helpers.success('Post updated');
	}
};
