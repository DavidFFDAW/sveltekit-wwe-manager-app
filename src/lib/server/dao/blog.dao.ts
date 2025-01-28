import prisma from '../prisma';

export const BlogDao = {
	required: [],
	getPosts: () => prisma.blogPost.findMany(),
	getOrderedPosts: () => prisma.blogPost.findMany({ orderBy: { created_at: 'desc' } }),
	getPostBySlug: (slug: string) => prisma.blogPost.findFirst({ where: { slug }, take: 1 }),
	getPublishedBlogPosts: () => {
		return prisma.blogPost.findMany({
			orderBy: {
				created_at: 'desc'
			},
			where: {
				visible: true
			}
		});
	},

	updateSlug: async (id: number, slug: string) => {
		return prisma.blogPost.update({
			where: { id },
			data: { slug }
		});
	}
};
