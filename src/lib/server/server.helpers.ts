import { Utils } from '$lib/utils/general.utils';
import { fail, json, redirect } from '@sveltejs/kit';

export const Helpers = {
	success: (message: string, status: number = 200) => {
		return {
			status,
			message
		};
	},
	error: (message: string, code?: number) => {
		return fail(code || 500, { message });
	},
	checkRequiredFields: (formData: FormData, requiredFields: string[]) => {
		const missingFields = requiredFields.filter(
			(field) => !formData.has(field) || !formData.get(field)
		);
		if (missingFields.length > 0)
			return { error: true, message: `Faltan campos requeridos: ${missingFields.join(', ')}` };
		return { error: false, message: '' };
	},
	slugify: Utils.slugify,
	apiResponse: (data: Record<string, any>, status: number = 200) => {
		return json(data, { status });
	},
	apiResponseMessage: (message: string, status: number = 200) => {
		return json({ message }, { status });
	},
	redirection: (url: string, status: number = 302) => {
		return redirect(status, url);
	},
	getSelectorItem(data: FormData, field?: string) {
		const number = field
			? data.get(`selected-${field}-resource-id`)
			: data.get('selected-resource-id');
		return {
			id: Number(number),
			name: (field
				? data.get(`selected-${name}-resource-name`)
				: data.get('selected-resource-name')) as string
		};
	},
	hasPermission: (locals: App.Locals, role: string = 'admin') => {
		return locals.user && locals.user.role === role;
	},
	getUpdateID: (data: FormData) => {
		return Number(data.get('_update_id'));
	},
	getToggleInput: (form: FormData, field: string): boolean => {
		if (form.has(field)) return form.get(field) === 'on';
		return false;
	},
	dataHas: (data: FormData, field: string): boolean => {
		return data.has(field) && data.get(field) !== '';
	}
};
