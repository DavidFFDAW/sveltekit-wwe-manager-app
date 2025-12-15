import { Prisma, type BlogPost } from '@prisma/client';
import { Repository } from './Repository';

export class BlogRepository extends Repository<
	BlogPost,
	Prisma.BlogPostCreateInput,
	Prisma.BlogPostUpdateInput,
	Prisma.BlogPostWhereInput,
	Prisma.BlogPostFindManyArgs
> {
	protected requiredFields: string[] = [];

	constructor() {
		super('blogPost');
	}

	public getPublishedPosts(): Promise<BlogPost[]> {
		return this.model.findMany({
			where: {
				visible: true,
				status: 'published',
				created_at: {
					lte: new Date()
				}
			},
			orderBy: {
				created_at: 'desc'
			}
		});
	}

	public getReadablePostBySlug(slug: string) {
		return this.model.findFirst({
			where: {
				slug,
				visible: true,
				status: 'published',
				created_at: {
					lte: new Date()
				}
			},
			take: 1
		});
	}

	public getTransformedObject(form: FormData): Prisma.BlogPostCreateInput {
		const datePublished = form.has('published_at')
			? new Date(form.get('published_at') as string)
			: new Date();

		return {
			title: form.get('title') as string,
			slug: form.get('slug') as string,
			image: (form.get('image') as string) || '',
			content: form.get('content') as string,
			admin: { connect: { id: Number(form.get('author')) } },
			exceptr: form.get('excerpt') as string,
			visible: form.has('visible') ? form.get('visible') === 'true' : false,
			status: form.has('status') ? (form.get('status') as string) : 'draft',
			category: form.has('category') ? (form.get('category') as string) : undefined,
			deletable: form.has('deletable') ? form.get('deletable') === 'true' : false,
			created_at: datePublished
		};
	}

	public getRequiredFields(): string[] {
		return ['title', 'slug', 'content', 'author', 'excerpt'];
	}
}
