import { GROQ_API_KEY } from '$env/static/private';
import { IaRepository } from '$lib/server/dao/repositories/ia.repository.js';
import { Api, Helpers } from '$lib/server/server.helpers.js';
import { groq } from '../services/groq.service.js';

export async function POST({ locals, request }) {
    if (!Helpers.hasPermission(locals)) return Api.error('No tienes permisos para realizar esta acción', 403);
    if (!GROQ_API_KEY) return Api.error('No se ha configurado la API de Groq', 500);

    const formData = await request.formData();
    const prompt = formData.get('prompt') as string;
    if (!prompt) return Api.error('No se ha proporcionado un prompt', 400);

    try {
        const repository = new IaRepository();
		const groqResponse = await groq.chat(
			[ prompt ],
			[
				'Eres un asistente útil que genera publicaciones de blog sobre lucha libre',
				'Escribe la respuesta directamente en HTML, sin etiquetas <html> ni <body> ni <h1> y sin <scripts> o <style>. Solo contenido',
            ],
            'llama-3.3-70b-versatile',
        );

        if (!groqResponse.ok) {
            console.error('Error trying to generate post', { groqResponse });
            return Api.error('Error al generar el contenido: ' + groqResponse.status, 500);
        }

        const message = groqResponse.data.choices[0].message;
        await repository.create({
            service: 'groq',
            model: 'llama-3.3-70b-versatile',
            request_id: groqResponse.data.id,
            status: groqResponse.data.choices[0].finish_reason === 'stop' ? 'success' : 'error',
            total_time: groqResponse.data.usage.completion_time,
            total_tokens: groqResponse.data.usage.total_tokens,
        });
		
        if (message.content.length <= 0) return Api.error('No se ha generado contenido', 500);
        return Api.response({ text: message.content }, 200);
    } catch (error) {
        console.error('Error trying to generate post', { error });
        return Api.error('Error al generar el contenido', 500);
    }
}
