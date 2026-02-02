import { HttpService } from '$lib/services/http.service';
import { MAIL_API_KEY, MAIL_API_URL } from '$env/static/private';
import fs from 'fs';

const getTemplateDirectory = (filename: string = '') => {
    return 'static/templates/emails/' + (filename ? `${filename}.html` : '');
};

export const EmailService = {
    getTemplateDirectory,
    getTemplateContent(filename: string) {
        const filePath = getTemplateDirectory(filename);
        return fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf-8') : '';
    },
    sendEmail(mailto: string | string[], subject: string, body: string) {
        return HttpService.post(MAIL_API_URL, {
            headers: {
                Authorization: `Bearer ${MAIL_API_KEY}`,
            },
            body: JSON.stringify({
                to: mailto,
                body: body,
                subject: subject,
            }),
        });
    },
    sendEmailTemplate(mailto: string | string[], subject: string, template: string, variables: Record<string, any>) {
        return HttpService.post(MAIL_API_URL, {
            headers: {
                Authorization: `Bearer ${MAIL_API_KEY}`,
            },
            body: JSON.stringify({
                body: '',
                to: mailto,
                subject: subject,
                template: template,
                variables: variables,
            }),
        });
    },
};
export default EmailService;
