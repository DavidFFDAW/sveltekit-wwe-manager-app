import { BlogRepository } from '$lib/server/dao/repositories/blog.repository.js';
import { InjuriesRepository } from '$lib/server/dao/repositories/injuries.repository';
import { WrestlerRepository } from '$lib/server/dao/repositories/wrestler.repository.js';
import { Helpers } from '$lib/server/server.helpers.js';
import { Utils } from '$lib/utils/general.utils.js';
import type { BlogPost, Injuries, Prisma, Wrestler } from '@prisma/client';

export const load = async ({ url }) => {
	const id = url.searchParams.get('id');
	const Injuries = new InjuriesRepository();
	const Wrestlers = new WrestlerRepository();

	const injury = id ? await Injuries.getById(id) : {};
	const wrestlers = await Wrestlers.getNonReleasedWrestlers({
		orderBy: {
			name: 'asc'
		}
	});

	return {
		injury_upsert: {
			injury,
			wrestlers,
			param_id: id
		}
	};
};

const validateInjuryForm = (formData: FormData) => {
	Helpers.checkRequiredFieldsThrow(formData, [
		'wrestler_id',
		'injury',
		'severity',
		'start_date',
		'end_date'
	]);

	const wrestlerId = Number(formData.get('wrestler_id'));
	if (!wrestlerId) throw new Error('El luchador es requerido');

	const startDate = Utils.getLocalDate(formData.get('start_date') as string);
	const endDate = Utils.getLocalDate(formData.get('end_date') as string);
	if (startDate > endDate) throw new Error('La fecha de inicio no puede ser mayor que la de fin');

	return {
		wrestlerId,
		startDate,
		endDate
	};
};

const getPostPayload = (
	formData: FormData,
	wrestler: Wrestler,
	injury: Injuries,
	adminId: number
): Prisma.BlogPostCreateInput => {
	const title =
		(formData.get('post_title') as string) || `${wrestler.name} estará de baja por lesión`;
	const excerpt =
		(formData.get('post_excerpt') as string) ||
		`${wrestler.name} estará alejado de la competición tras sufrir ${injury.injury.toLowerCase()}.`;

	return {
		title,
		slug: `${Helpers.slugify(title)}-${injury.id}`,
		exceptr: excerpt,
		content: `<p>${excerpt}</p>`,
		image: wrestler.image_name || '',
		admin: {
			connect: {
				id: adminId
			}
		},
		visible: false,
		status: 'draft',
		category: 'Lesiones',
		deletable: true
	};
};

const upsertBlogPost = async (
	formData: FormData,
	wrestler: Wrestler,
	injury: Injuries,
	adminId: number
): Promise<BlogPost> => {
	const Blog = new BlogRepository();
	const postPayload = getPostPayload(formData, wrestler, injury, adminId);

	if (injury.post_id) return Blog.updateById(injury.post_id, postPayload);

	const post = await Blog.create(postPayload);
	await new InjuriesRepository().updateById(injury.id, {
		Post: {
			connect: {
				id: post.id
			}
		}
	});

	return post;
};

export const actions = {
	upsert: async ({ request, locals }) => {
		if (!Helpers.hasPermission(locals)) return Helpers.error('No tienes permisos', 403);

		const formData = await request.formData();
		const Injuries = new InjuriesRepository();
		const Wrestlers = new WrestlerRepository();

		try {
			const { wrestlerId, startDate, endDate } = validateInjuryForm(formData);
			const updateId = Helpers.getUpdateID(formData);
			const wrestler = await Wrestlers.getById(wrestlerId);
			if (!wrestler) return Helpers.error('No se ha encontrado el luchador', 404);

			const savedInjury = await Injuries.upsert(
				{
					injury: formData.get('injury') as string,
					severity: formData.get('severity') as string,
					start_date: startDate,
					end_date: endDate,
					is_notified: formData.get('is_notified') === '1',
					Wrestler: {
						connect: {
							id: wrestlerId
						}
					}
				},
				updateId || null
			);

			if (formData.get('create_post') === '1') {
				await upsertBlogPost(formData, wrestler, savedInjury, locals.user?.uuid || 1);
			}

			await Wrestlers.updateById(wrestlerId, {
				status: 'injured'
			});

			return Helpers.success(
				updateId ? 'Lesión actualizada correctamente' : 'Lesión creada correctamente',
				200
			);
		} catch (e) {
			console.error(e);
			return Helpers.error(
				e instanceof Error ? e.message : 'No se ha podido guardar esta lesión',
				500
			);
		}
	}
};
