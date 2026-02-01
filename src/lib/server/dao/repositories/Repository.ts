// src/repositories/baseRepository.ts
import { PrismaClient } from '@prisma/client';
import prisma from '$lib/server/prisma';
import type { EntityWithId } from '../../../../@types/Entity';
import type { PaginationDatas } from '$lib/types/app.types';

export abstract class Repository<
	T extends EntityWithId,
	CreateInput,
	UpdateInput,
	WhereUniqueInput,
	FindManyArgs
> {
	protected requiredFields: string[] = [];
	protected prisma: PrismaClient;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	protected model: any; // Aquí guardaremos la referencia al cliente del modelo de Prisma

	constructor(modelName: keyof PrismaClient) {
		this.prisma = prisma;
		// Asegurarse de que el modelo existe en el cliente de Prisma
		if (typeof this.prisma[modelName] === 'object') {
			this.model = this.prisma[modelName];
		} else {
			throw new Error(`Model ${String(modelName)} not found in Prisma client.`);
		}
	}

	conn() {
		return this.prisma;
	}

	getTableNameFromModelName(): string {
		return this.model.name.replace(/([A-Z])/g, '_$1').toLowerCase();
	}

	select(select: Record<string, boolean>, args?: FindManyArgs): Promise<T[]> {
		return this.model.findMany({
			...args,
			select: select
		});
	}

	get(args?: FindManyArgs): Promise<T[]> {
		return this.model.findMany(args);
	}

	getRow(args?: FindManyArgs): Promise<T> {
		return this.model.findFirst({
			...args,
			take: 1
		});
	}

	getBySlug(slug: string): Promise<T | null> {
		return this.model.findUnique({
			where: { slug }
		});
	}

	getBySlugOrId(slugOrId: string | number): Promise<T | null> {
		const isId = typeof slugOrId === 'number' || !isNaN(Number(slugOrId));
		const whereQuery = isId ? { id: Number(slugOrId) } : { slug: slugOrId };

		return this.model.findFirst({
			where: {
				...whereQuery
			}
		});
	}

	getSingleById(id: number): Promise<T | null> {
		return this.model.findUnique({
			where: { id }
		});
	}

	paginate(page: number, args?: FindManyArgs, take: number = 15): Promise<[number, T[]]> {
		const prepage = page < 1 ? 1 : page;
		const skip = (prepage - 1) * take;

		return Promise.all([
			this.model.count(args),
			this.model.findMany({
				...args,
				take,
				skip
			})
		]);
	}

	async paginateN(
		page: number,
		args?: FindManyArgs,
		take: number = 15
	): Promise<PaginationDatas<T>> {
		const prepage = page < 1 ? 1 : page;
		const skip = (prepage - 1) * take;

		const [totals, filtereds] = await Promise.all([
			this.model.count(args),
			this.model.findMany({
				...args,
				take,
				skip
			})
		]);

		return {
			list: filtereds,
			perPage: take,
			totalItems: totals,
			currentPage: prepage,
			pages: Math.ceil(totals / take)
		};
	}

	unique(where: WhereUniqueInput): Promise<T | null> {
		return this.model.findUnique({ where });
	}

	create(data: CreateInput): Promise<T> {
		return this.model.create({ data });
	}

	bulkCreate(data: CreateInput[]): Promise<T[]> {
		return this.model.createMany({ data });
	}

	update(where: WhereUniqueInput, data: UpdateInput): Promise<T> {
		return this.model.update({ where, data });
	}
	updateById(id: number, data: UpdateInput): Promise<T> {
		return this.model.update({ where: { id }, data });
	}

	bulkUpdate(where: WhereUniqueInput, data: UpdateInput): Promise<T[]> {
		return this.model.updateMany({ where, data });
	}

	delete(where: WhereUniqueInput): Promise<T> {
		return this.model.delete({ where });
	}

	deleteByIdOrSlug(idOrSlug: string | number): Promise<T | null> {
		const isId = typeof idOrSlug === 'number' || !isNaN(Number(idOrSlug));
		const whereQuery = isId ? { id: Number(idOrSlug) } : { slug: idOrSlug };

		return this.model.delete({
			where: {
				...whereQuery
			}
		});
	}

	truncate(): Promise<number> {
		return this.prisma.$executeRaw`TRUNCATE TABLE ${this.model._meta.name};`;
	}

	deleteAll(): Promise<number> {
		return this.model.deleteMany({});
	}

	getRequiredFields(): string[] {
		return this.requiredFields;
	}

	getSingleByField(field: string, value: string | number) {
		return this.model.findFirst({
			where: {
				[field]: value
			}
		});
	}
}
