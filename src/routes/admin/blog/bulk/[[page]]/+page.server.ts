import { blog } from "$lib/server/dao/repositories/blog.repository";
import { Helpers } from "$lib/server/server.helpers.js";

export const load = async ({ params }) => {
	const pageSize = 15;
	const page = Number(params.page) ?? 1;
	if (isNaN(page) || page < 1)
		return Helpers.redirection('/admin/blog/bulk/1');

	const total = await blog.getPrismaModel().count();
	const totalPages = Math.ceil(total / pageSize);
	const list = await blog.get({
		select: {
			id: true,
			title: true,
			visible: true,
			status: true,
			category: true,
			image: true,
			created_at: true,
		},
		orderBy: {
			created_at: 'desc',
		},
		skip: (page - 1) * pageSize,
		take: pageSize
	});

	return {
		posts: list,
		pagination: {
			current: page,
			size: pageSize,
			pages: totalPages,
			hasNext: page < totalPages,
			hasPrev: page > 1,
			total
		}
	};
}