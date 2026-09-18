import EmailService from '$lib/server/services/email.server.service';
import { dirname } from 'path';

export const GET = async () => {
    try {
        const templateRoute = EmailService.getTemplateDirectory('blog');
        return new Response(
            JSON.stringify({
                templateRoute,
                root: process.cwd(),
                dirname: dirname,
                dir: __dirname,
            }),
            { status: 200 },
        );
    } catch (e: unknown) {
        if (e instanceof Error) return new Response(e.message, { status: 500 });
        return new Response('Ha ocurrido un error inesperado', { status: 500 });
    }
};
