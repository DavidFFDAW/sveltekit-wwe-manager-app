import { Prisma, type PPV } from '@prisma/client';
import { Repository } from './Repository';

export class BlogRepository extends Repository<
	PPV,
	Prisma.BlogPostCreateInput,
	Prisma.BlogPostUpdateInput,
	Prisma.BlogPostWhereInput,
	Prisma.BlogPostFindManyArgs
> {
	protected requiredFields: string[] = [];

	constructor() {
		super('blogPost');
	}
}
