import EmailService from '$lib/server/services/email.server.service';
import fs from 'fs/promises';

async function checkIfFile(filePath: string) {
    try {
        await fs.access(filePath, fs.constants.F_OK);
        return true;
    } catch (error) {
        return false;
    }
}

export const GET = async () => {
    try {
        const root = process.cwd();
        const files = await fs.readdir(root);
        const templateRoute = EmailService.getTemplateDirectory('blog');
        const templateExists = checkIfFile(templateRoute);

        return new Response(
            JSON.stringify({
                root,
                files,
                templateRoute,
                templateExists,
            }),
            { status: 200 },
        );
    } catch (e: unknown) {
        if (e instanceof Error) return new Response(e.message, { status: 500 });
        return new Response('Ha ocurrido un error inesperado', { status: 500 });
    }
};
