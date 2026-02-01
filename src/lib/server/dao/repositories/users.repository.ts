import { Prisma, type BlogPost, type User } from '@prisma/client';
import { Repository } from './Repository';

export class UsersRepository extends Repository<
	User,
	Prisma.UserCreateInput,
	Prisma.UserUpdateInput,
	Prisma.UserWhereInput,
	Prisma.UserFindManyArgs
> {
	protected requiredFields: string[] = [];

	constructor() {
		super('user');
	}

	public getEmailSubscribedUsers() {
		return this.model.findMany({
			where: {
				newsletter_subscription: true,
				active: true
			}
		});
	}

	public getSubscribedPushUsers() {
		return this.model.findMany({
			where: {
				active: true
			},
			include: {
				Subscription: true
			}
		});
	}
}
