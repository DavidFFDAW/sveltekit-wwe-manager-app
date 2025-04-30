import type { Prisma } from '@prisma/client';
import type { BlogObject } from '../interfaces';
import prisma from '../prisma';

export const BlogDao = {
	required: [],
	getPosts: () => prisma.blogPost.findMany(),
	getOrderedPosts: () => prisma.blogPost.findMany({ orderBy: { created_at: 'desc' } }),
	getPostBySlug: (slug: string) => prisma.blogPost.findFirst({ where: { slug }, take: 1 }),
	getPostById: (id: number) => prisma.blogPost.findFirst({ where: { id }, take: 1 }),
	getPublishedBlogPosts: () => {
		return prisma.blogPost.findMany({
			orderBy: {
				created_at: 'desc'
			},
			where: {
				visible: true,
				created_at: {
					lte: new Date()
				}
			}
		});
	},
	getReadablePostBySlug: (slug: string) => {
		return prisma.blogPost.findFirst({
			where: {
				slug,
				visible: true,
				created_at: {
					lte: new Date()
				}
			},
			take: 1
		});
	},

	createBlogPost: (datas: BlogObject) => {
		return prisma.blogPost.create({
			data: datas
		});
	},

	updateBlogPost: (uuid: number, datas: BlogObject) => {
		return prisma.blogPost.update({
			where: { id: Number(uuid) },
			data: datas
		});
	},

	updateSlug: (id: number, slug: string) => {
		return prisma.blogPost.update({
			where: { id },
			data: { slug }
		});
	},
	updatePublish: (id: number, visible: boolean) => {
		return prisma.blogPost.update({
			where: { id },
			data: { visible }
		});
	},
	updatePostViews: (id: number) => {
		return prisma.blogPost.update({
			where: { id },
			data: {
				views: { increment: 1 }
			}
		});
	},
	update(id: number, data: Prisma.BlogPostUpdateInput) {
		return prisma.blogPost.update({
			where: { id },
			data
		});
	}
};
