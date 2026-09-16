import {
	MAIL_API_ADMIN,
	MAIL_API_KEY,
	MAIL_API_URL
} from "$env/static/private";
import type { EmailOptions } from "$lib/global.interfaces";

export const EmailUtils = {
	sendSimpleEmail: (emails: string[], subject: string, body: string) => {
		if (!emails.length) return false;
		const uniqueTo = [...new Set([...emails, MAIL_API_ADMIN])];

		return fetch(MAIL_API_URL, {
			mode: 'cors',
			method: 'POST',
			headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${MAIL_API_KEY}` },
			body: JSON.stringify({
				to: uniqueTo,
				subject,
				body
			})
		});
	},
	sendEmail: ({ emails, html, subject, body, variables }: EmailOptions, simpleEmail: boolean = false) => {
		const emailsArray = Array.isArray(emails) ? emails : [emails];
		const uniqueTo = [...new Set([...emailsArray, MAIL_API_ADMIN])];

		const options: any = {
			to: uniqueTo,
			subject,
			body,
			from: { email: 'no-reply-wwe-manager@wwemanager.es', name: 'WWE@Manager' }
		}
		if (!simpleEmail) {
			options['html'] = html;
			options['variables'] = variables;
		}

		return fetch(MAIL_API_URL, {
			mode: 'cors',
			method: 'POST',
			headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${MAIL_API_KEY}` },
			body: JSON.stringify(options)
		});
	}
}