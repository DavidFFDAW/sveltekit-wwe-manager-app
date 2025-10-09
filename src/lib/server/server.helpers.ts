import { MAIL_API_ADMIN, MAIL_API_KEY, MAIL_API_URL } from '$env/static/private';
import { getParsedFormDatas, Utils } from '$lib/utils/general.utils';
import { fail, json, redirect } from '@sveltejs/kit';
import fs from 'fs';
import { Api as ApiHelpers } from './api.helpers';

interface EmailOptions {
	emails: string | string[];
	html: string;
	subject: string;
	from?: { email: string; name: string };
	body?: string;
	variables: { [key: string]: string };
}

export const Api = ApiHelpers;
export const Helpers = {
	api: Api,
	success: (message: string, status: number = 200) => {
		return {
			status,
			message
		};
	},
	error: (message: string, code?: number) => {
		return fail(code || 500, { message });
	},
	getParsedFormDatas,
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
	getDateRange: (formData: FormData, name: string = 'resource-dates') => {
		const startDate = formData.get(`${name}-range-start-date`) as string | null;
		const endDate = formData.get(`${name}-range-end-date`) as string | null;

		return {
			start: startDate ? Utils.getLocalDate(startDate) : null,
			end: endDate ? Utils.getLocalDate(endDate) : null
		};
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
		if (!locals.user) return false;
		const userRoles = [role, 'superadmin', 'admin'];
		return userRoles.includes(locals.user.role);
	},
	getUpdateID: (data: FormData) => {
		return Number(data.get('_update_id'));
	},
	getUrlSlug: (params: Record<string, string | number>, field: string) => {
		if (!params[field]) return null;
		return Number(params[field]);
	},
	getToggleInput: (form: FormData, field: string): boolean => {
		if (form.has(field)) return form.get(field) === 'on';
		return false;
	},
	getAction: (form: FormData): string | null => {
		return form.get('_action') as string | null;
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
