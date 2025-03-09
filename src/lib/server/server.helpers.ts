import { MAIL_API_ADMIN, MAIL_API_KEY, MAIL_API_URL } from '$env/static/private';
import { Utils } from '$lib/utils/general.utils';
import { fail, json, redirect } from '@sveltejs/kit';
import fs from 'fs';

interface EmailOptions {
	emails: string | string[];
	html: string;
	subject: string;
	from?: { email: string; name: string };
	body?: string;
	variables: { [key: string]: string };
}

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
	},
	writeLog: (filename: string, data: Record<string, any>) => {
		return fs.writeFileSync(`./src/logs/${filename}.json`, JSON.stringify(data, null, 4));
	},
	sendEmail: ({ emails, html, subject, body, variables }: EmailOptions) => {
		const emailsArray = Array.isArray(emails) ? emails : [emails];
		const uniqueTo = [...new Set([...emailsArray, MAIL_API_ADMIN])];

		console.log({ uniqueTo, subject, html, variables, body });
		return fetch(MAIL_API_URL, {
			mode: 'cors',
			method: 'POST',
			headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${MAIL_API_KEY}` },
			body: JSON.stringify({
				to: uniqueTo,
				subject,
				variables,
				template: html,
				body,
				from: { email: 'no-reply-wwe-manager@wwemanager.es', name: 'WWE@Manager' }
			})
		});
	}
};
