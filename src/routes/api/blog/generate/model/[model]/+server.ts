import IaService from '../../services/ia.service.js';
import { Api, Helpers } from '$lib/server/server.helpers.js';
import { IaRepository } from '$lib/server/dao/repositories/ia.repository.js';
// import { IaRepository } from '$lib/server/dao/repositories/ia.repository.js';

export async function POST({ locals, request, params }) {
    if (!Helpers.hasPermission(locals))
        return Api.error('No tienes permisos para realizar esta acción', 403);

    try {
        const provider = params.model;
        if (!provider) return Api.error('No se ha especificado un modelo', 400);
        if (!IaService.isValidProvider(provider))
            return Api.error('El modelo especificado no es válido', 400);

        const apiKey = IaService.getApiKey(provider);
        if (!apiKey) return Api.error(`No se ha configurado la API de ${provider}`, 500);

        const formData = await request.formData();
        const prompt = formData.get('prompt') as string;
        if (!prompt) return Api.error('No se ha proporcionado un prompt', 400);

        const logs = new IaRepository();
        const model = IaService.getModelByProvider(provider);
        const service = IaService.getServiceByModel(provider);

        const response = await service.chat({
            prompts: [prompt],
            instructions: [
                'Genera un post breve para blog para el modo universo de WWE2K según el prompt del usuario. Devuelve JSON válido con title, excerpt (≤150 caracteres, que resuma el contenido) y content en HTML (párrafos, sin negritas ni mayúsculas excesivas y en español), sin etiquetas <html>, <body>, <h1>, <script> ni <style>, ni markdown ni explicaciones.'
            ],
            model: model,
        });

        if (!response.ok) {
            console.error('Error trying to generate post', { response });
            return Api.error('Error al generar el contenido: ' + response.status, 500);
        }

        console.log({
            response
        });
        // replace ```json and ``` if they exist, and unescape newlines and quotes
        const curatedText = response.text.replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/```json/g, '').replace(/```/g, '').trim();
        const json = JSON.parse(curatedText) as { title: string; excerpt: string; content: string };
        if (!json || !json.content) {
            console.error('Invalid response format from IA service', { response });
            return Api.error('El formato de respuesta del servicio de IA no es válido', 500);
        }

        const message = response.text;
        await logs.register({
            model: model,
            service: provider,
            request_id: response.request_id,
            status: response.finish_reason,
            total_time: response.total_time,
            total_tokens: response.total_tokens
        });

        if (message.length <= 0) return Api.error('No se ha generado contenido', 500);
        return Api.response({ title: json.title, text: json.content, excerpt: json.excerpt }, 200);
    } catch (error: any) {
        console.error('Error trying to generate content', { error });
        return Api.error('Ha ocurrido un error (' + (error.message) + ')', 500);
    }
}
