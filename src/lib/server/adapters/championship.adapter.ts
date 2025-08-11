import type { Prisma } from '@prisma/client';
import { Helpers } from '../server.helpers';

export const ChampionshipAdapter = {
	requiredFields: ['name', 'slug', 'image'],
	getTransformedObject: (
		form: FormData
	): Prisma.ChampionshipUncheckedCreateInput | Prisma.ChampionshipUncheckedUpdateInput => {
		return {
			name: form.get('name') as string,
			metadata: (form.get('metadata') as string) || (form.get('slug') as string),
			slug: form.get('slug') as string,
			image: form.get('image') as string,
			active: Helpers.getToggleInput(form, 'active'),
			brand: form.get('brand') as string,
			order: Number(form.get('order')),
			short_title: form.get('short_title') as string,
			gender: form.get('gender') as string,
			tag: Helpers.getToggleInput(form, 'tag_team')
		};
	}
};
