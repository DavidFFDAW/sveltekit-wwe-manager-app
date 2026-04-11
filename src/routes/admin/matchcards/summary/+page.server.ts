import { redirect } from '@sveltejs/kit';
import { PpvCardRepository } from '$lib/server/dao/repositories/matchcard.repository.js';
import { Helpers } from '$lib/server/server.helpers.js';
import { BlogRepository } from '$lib/server/dao/repositories/blog.repository.js';
import { Utils } from '$lib/utils/general.utils.js';

export const load = async ({ url }) => {
	const id = url.searchParams.get('id');
	if (!id) return redirect(302, '/admin/matchcards');

	const matchcardId = Number(id);
	if (isNaN(matchcardId)) return redirect(302, '/admin/matchcards');

	const repository = new PpvCardRepository();
	const card_data = await repository.getRow({
		where: {
			id: matchcardId
		},
		include: {
			matches: {
				orderBy: [
					{
						night: 'asc'
					},
					{
						order: 'asc'
					}
				]
			}
		}
	});

	const matches = 'matches' in card_data ? (card_data.matches as any[]) : [];
	const groupedByNight: Record<string, any[]> = matches.reduce((acc, match) => {
		const night = match.night || 1;
		match.notes = '';
		if (!acc[night]) {
			acc[night] = [];
		}
		acc[night].push(match);
		return acc;
	}, {});
	const nights = Object.keys(groupedByNight).map((night) => Number(night));

	return {
		ppv: {
			id: card_data.id,
			name: card_data.ppv_name,
			image: card_data.ppv_image,
			date: card_data.ppv_date,
			post: card_data.post_id
		},
		hasLinkedPost: Boolean(card_data.post_id),
		hasMultipleNights: nights.length > 1,
		matches: groupedByNight,
		nights: nights
	};
};

export const actions = {
	default: async ({ request, locals, url }) => {
		try {
			if (!Helpers.hasPermission(locals))
				return Helpers.error('No tienes permiso para realizar esta acción', 403);

			const urlId = Number(url.searchParams.get('id'));
			const formData = await request.formData();
			const action = formData.get('action');
			const updateId = Helpers.getUpdateID(formData);

			if (!urlId || isNaN(urlId)) return Helpers.error('ID de matchcard no válido', 400);
			if (!updateId || isNaN(updateId)) return Helpers.error('ID de actualización no válido', 400);
			if (updateId !== urlId)
				return Helpers.error('ID de actualización no coincide con el de la URL', 400);

			if (action !== 'create_summary') return Helpers.error('Acción no soportada', 400);

			const { error, message } = Helpers.checkRequiredFields(formData, [
				'name',
				'date',
				'image',
				'content'
			]);
			if (error) return Helpers.error(message, 400);

			const datas = {
				name: formData.get('name') as string,
				date: new Date(formData.get('date') as string),
				image: formData.get('image') as string,
				content: formData.get('content') as string
			};
			const title = `Resumen de ${datas.name}`;
			const author = locals.user?.uuid ? Number(locals.user?.uuid) : 0;

			const postRepository = new BlogRepository();
			const ppvCardRepository = new PpvCardRepository();
			const createdPost = await postRepository.create({
				title: title.trim(),
				slug: Helpers.slugify(title),
				content: datas.content.trim(),
				status: 'published',
				created_at: datas.date,
				category: 'summary',
				image: datas.image.trim(),
				visible: true,
				exceptr: `Resumen del evento ${datas.name}, celebrado el ${Utils.getDateLocale(datas.date)}. En este post encontrarás un resumen de lo acontecido en el evento.`,
				admin: { connect: { id: author } }
			});

			if (!createdPost) return Helpers.error('No se pudo crear el post', 500);

			await ppvCardRepository.updateById(urlId, {
				post_id: createdPost.id
			});

			return Helpers.success('Post creado correctamente', 201);
		} catch (err) {
			console.error('Error processing form data:', err);
			return Helpers.error('Error al procesar los datos del formulario', 500);
		}
	}
};
