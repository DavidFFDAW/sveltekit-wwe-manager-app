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

        console.log({
            message: 'Generating content with IA',
            provider,
            model: IaService.getModelByProvider(provider)
        });


        const formData = await request.formData();
        const prompt = formData.get('prompt') as string;
        if (!prompt) return Api.error('No se ha proporcionado un prompt', 400);

        const repository = new IaRepository();
        const model = IaService.getModelByProvider(provider);
        const service = IaService.getServiceByModel(provider);

        const response = await service.chat({
            prompts: [prompt],
            instructions: [
                'Genera un post de blog sobre lucha libre según el contexto dado. Incluye título sugerido, excerpt breve y contenido en HTML, sin <html>, <body>, <h1>, <script> ni <style>'
            ],
            model: model,
        });

        if (!response.ok) {
            console.error('Error trying to generate post', { response });
            return Api.error('Error al generar el contenido: ' + response.status, 500);
        }

        const message = response.text;
        console.log({ response: response });


        await repository.create({
            model: model,
            service: provider,
            request_id: response.request_id,
            status: response.finish_reason,
            total_time: response.total_time,
            total_tokens: response.total_tokens
        });

        if (message.length <= 0) return Api.error('No se ha generado contenido', 500);
        return Api.response({ text: message }, 200);
    } catch (error: any) {
        console.error('Error trying to generate content', { error });
        return Api.error('Ha ocurrido un error (' + (error.message) + ')', 500);
    }
}
