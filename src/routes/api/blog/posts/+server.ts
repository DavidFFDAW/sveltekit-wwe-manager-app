import { Helpers } from './../../../../lib/server/server.helpers';
import DateUtils from '$lib/utils/date.utils';
import { BlogRepository } from '$lib/server/dao/repositories/blog.repository';

export const GET = async ({ request, url }) => {
	try {
		const perpage = 10;
		const repository = new BlogRepository();
		const page = parseInt(url.searchParams.get('page') || '1', 10);
		const date = DateUtils.getDateInstanceTimezone(new Date(), 'Europe/Madrid');
		const { list, pages } = await repository.paginateN(page, {
			where: {
				status: 'published',
				created_at: {
					lte: date
				},
				visible: true,
			},
			orderBy: {
				created_at: 'desc'
			}
		}, perpage);

		return Helpers.api.json({
			next_url: page < pages ? `${url.origin}/api/blog/posts?page=${page + 1}` : null,
			posts: list
		}, 200);
	} catch (error) {
		return Helpers.api.error('Error fetching blog posts', 500);
	}
};