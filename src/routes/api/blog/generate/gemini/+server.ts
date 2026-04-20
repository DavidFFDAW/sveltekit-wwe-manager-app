import { GEMINI_API_KEY } from '$env/static/private';
// import { IaRepository } from '$lib/server/dao/repositories/ia.repository.js';
import { Api, Helpers } from '$lib/server/server.helpers.js';
import { gemini } from '../services/gemini.service.js';

export async function POST({ locals, request }) {
	if (!Helpers.hasPermission(locals))
		return Api.error('No tienes permisos para realizar esta acción', 403);
	if (!GEMINI_API_KEY) return Api.error('No se ha configurado la API de Gemini', 500);

	const formData = await request.formData();
	const prompt = formData.get('prompt') as string;
	if (!prompt) return Api.error('No se ha proporcionado un prompt', 400);

	try {
		const model = 'gemini-2.5-flash-lite';
		// const repository = new IaRepository();
		const iaResponse = await gemini.chat(
			[prompt],
			[
				'Eres un asistente útil que genera publicaciones de blog sobre lucha libre',
				'Escribe la respuesta directamente en HTML, sin etiquetas <html> ni <body> ni <h1> y sin <scripts> o <style> y sin usar negrita'
			],
			model
		);

		const response = await iaResponse.json();
		if (!iaResponse.ok) {
			console.error('Error trying to generate post', { response });
			return Api.error('Error al generar el contenido: ' + response.error.status, 500);
		}

		// await repository.create({
		//     service: 'gemini',
		//     model: model,
		//     request_id: response.id,
		//     status: response.choices[0].finish_reason === 'stop' ? 'success' : 'error',
		//     total_time: response.usage.completion_time,
		//     total_tokens: response.usage.total_tokens
		// });

		const content = iaResponse.candidates[0];
		if (content.length <= 0) return Api.error('No se ha generado contenido', 500);

		const texts = content.parts.map((part: { text: string }) => part.text).join('');
		if (!texts) return Api.error('Error al generar el contenido', 500);
		return Api.response({ content, texts }, 200);
	} catch (error) {
		console.error('Error trying to generate post', { error });
		return Api.error('Error al generar el contenido', 500);
	}
}
