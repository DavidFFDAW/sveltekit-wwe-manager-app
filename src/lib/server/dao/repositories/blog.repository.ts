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
	public allowedStatuses: string[] = ['draft', 'published', 'unpublished'];

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

		const haAutodelete = form.get('auto_delete') === 'active';
		const status = form.has('post_status') ? (form.get('post_status') as string) : 'draft';
		const f_status = this.isStatusAllowed(status) ? status : 'draft';
		const visible = f_status === 'published';

		return {
			title: form.get('title') as string,
			slug: form.get('slug') as string,
			image: (form.get('image') as string) || '',
			content: form.get('content') as string,
			admin: { connect: { id: Number(form.get('author')) } },
			exceptr: form.get('excerpt') as string,
			visible: visible,
			status: f_status,
			category: form.has('category') ? (form.get('category') as string) : undefined,
			deletable: haAutodelete,
			created_at: datePublished
		};
	}

	public getRequiredFields(): string[] {
		return ['title', 'slug', 'content', 'author', 'excerpt'];
	}

	public isStatusAllowed(status: string): boolean {
		return this.allowedStatuses.includes(status);
	}
}
