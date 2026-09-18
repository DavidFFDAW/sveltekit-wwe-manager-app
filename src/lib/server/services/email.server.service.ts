import { MAIL_API_ADMIN, MAIL_API_KEY, MAIL_API_URL } from '$env/static/private';
import type { EmailBaseOptions, EmailOptions, EmailResponse, Emails } from '$lib/global.interfaces';
import { dirname } from 'path';
import fs from 'fs';

export const EmailService = {
    getTemplateDirectory(filename: string = '') {
        const rootPath = process.cwd();
        console.log('getTemplateDirectory: ', { rootPath, filename, dirname });
        return 'static/templates/emails/' + (filename ? `${filename}.html` : '');
    },
    getTemplateContent(filename: string) {
        const filePath = this.getTemplateDirectory(filename);
        return fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf-8') : '';
    },
    getEmailsTo(emails: Emails) {
        const emailsArray = Array.isArray(emails) ? emails : [emails];
        return [...new Set([...emailsArray, MAIL_API_ADMIN])];
    },
    getEmailBaseOptions(emails: Emails, subject: string, body: string | undefined = ''): EmailBaseOptions {
        return {
            to: this.getEmailsTo(emails),
            subject,
            body: body || '',
            from: 'WWE@Manager',
        };
    },
    emailRequest(content: any) {
        return fetch(MAIL_API_URL, {
            mode: 'cors',
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${MAIL_API_KEY}` },
            body: JSON.stringify(content),
        });
    },

    sendSimpleEmail(emails: Emails, subject: string, body: string) {
        if (!emails.length) return false;
        return this.emailRequest(this.getEmailBaseOptions(emails, subject, body));
    },

    sendEmail({ emails, html, subject, body, variables }: EmailOptions, simpleEmail: boolean = false) {
        const options: any = this.getEmailBaseOptions(emails, subject, body);
        if (!simpleEmail) {
            options['html'] = html;
            options['variables'] = variables;
        }

        return this.emailRequest(options);
    },
    sendEmailTemplate(emails: Emails, subject: string, template: string, variables: Record<string, any>) {
        const baseOptions = this.getEmailBaseOptions(emails, subject);
        return this.emailRequest({
            ...baseOptions,
            template: template,
            variables: variables,
        });
    },
    sendEmailWithTemplate(emails: Emails, subject: string, template: string, variables: Record<string, any>) {
        const baseOptions = this.getEmailBaseOptions(emails, subject);
        const templateContent = this.getTemplateContent(template);

        return this.emailRequest({
            ...baseOptions,
            template: templateContent,
            variables: variables,
        });
    },
};
export default EmailService;
