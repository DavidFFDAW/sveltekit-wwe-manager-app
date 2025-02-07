import prisma from '../prisma';
import type { WrestlerObject } from '../interfaces';

export const WrestlerDao = {
    required: ['name', 'brand', 'slug', 'status', 'twitter_acc', 'twitter_name', 'finisher', 'overall', 'gender'],
    transformToWrestlerObject(form: FormData): WrestlerObject {
        return {
            name: form.get('name') as string,
            alias: form.get('alias') as string,
            slug: form.get('slug') as string,
            brand: form.get('brand') as string,
            status: form.get('status') as string,
            is_tag: form.has('is_tag') ? form.get('is_tag') === 'on' : null,
            is_champ: form.has('is_champ') ? form.get('is_champ') === 'on' : null,
            twitter_acc: form.get('twitter_acc') as string,
            twitter_name: form.get('twitter_name') as string,
            finisher: form.get('finisher') as string,
            overall: Number(form.get('overall')),
            image_name: form.get('image') as string,
            sex: form.get('gender') as string,
            kayfabe_status: form.has('kayfabe_status') ? (form.get('kayfabe_status') as string) : null,
            twitter_image: form.get('twitter_image') as string,
            categories: form.has('categories') ? form.getAll('categories').join(',') : null,
        };
    },

    getWrestlers(config: {} = {}) {
        return prisma.wrestler.findMany(config);
    },

    getReignSelectableWrestlers() {
        return prisma.wrestler.findMany({
            where: {
                status: {
                    not: 'injured',
                },
            },
            select: {
                id: true,
                name: true,
                image_name: true,
                sex: true,
                status: true,
            },
        });
    },

    updateWrestler(wrestler: WrestlerObject, id: number) {
        return prisma.wrestler.update({
            data: wrestler,
            where: { id },
        });
    },

    updatePartialWrestler(datas: Record<string, unknown>, id: number) {
        return prisma.wrestler.update({
            data: datas,
            where: { id },
        });
    },

    updateImage(image: string, id: number) {
        return prisma.wrestler.update({
            data: { image_name: image },
            where: { id },
        });
    },

    createWrestler(wrestler: WrestlerObject) {
        return prisma.wrestler.create({
            data: wrestler,
        });
    },
};
