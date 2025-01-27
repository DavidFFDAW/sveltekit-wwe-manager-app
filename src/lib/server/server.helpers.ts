import { Utils } from '$lib/utils/general.utils';
import { fail, json, redirect } from '@sveltejs/kit';

export const Helpers = {
    success: (message: string, status: number = 200) => {
        return {
            status,
            message,
        };
    },
    error: (message: string, code?: number) => {
        return fail(code || 500, { message });
    },
    checkRequiredFields: (formData: FormData, requiredFields: string[]) => {
        const missingFields = requiredFields.filter(field => !formData.has(field) || !formData.get(field));
        if (missingFields.length > 0)
            return { error: true, message: `Faltan campos requeridos: ${missingFields.join(', ')}` };
        return { error: false, message: '' };
    },
    slugify: Utils.slugify,
    apiResponse: (data: any, status: number = 200) => {
        return json(data, { status });
    },
    redirection: (url: string, status: number = 302) => {
        return redirect(status, url);
    },
};
