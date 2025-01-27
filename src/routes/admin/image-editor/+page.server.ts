import { IMAGE_API_URL } from '$env/static/private';
import prisma from '$lib/server/prisma';
import { Helpers } from '$lib/server/server.helpers.js';
// import fs from 'fs';

export const load = async ({ locals }) => {
    if (!locals.user) throw Helpers.redirection('/admin/dashboard');

    return {
        wrestlers: await prisma.wrestler.findMany({
            orderBy: {
                name: 'asc',
            },
        }),
        hasApiToken: Boolean(locals.user.api_token),
    };
};

export const actions = {
    upsertImage: async ({ request }) => {
        const api = `${IMAGE_API_URL}/image/bydataurl/upsert`;
        const datas = await request.formData();

        const imageDataURL = datas.get('editor-image-data-resource') as string;
        const uploadingName = datas.get('selected-editor-resource-name') as string;
        console.log({ api, uploadingName: Helpers.slugify(uploadingName) });
        if (!imageDataURL) return Helpers.error('No image data URL provided');

        const file = new File([Buffer.from(imageDataURL.split(',')[1], 'base64')], 'image.webp', {
            type: 'image/webp',
        });
        if (file.size / 1024 > 100) return Helpers.error('El tamaño de la imagen es demasiado grande para guardarla');

        const requestBody = new FormData();
        requestBody.append('name', uploadingName ? Helpers.slugify(uploadingName) : '');

        return Helpers.success('Image saved');
    },
};
