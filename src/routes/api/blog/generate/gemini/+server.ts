import { Api, Helpers } from '$lib/server/server.helpers.js';
import { IaRepository } from '$lib/server/dao/repositories/ia.repository.js';
import IaService from '../services/ia.service.js';

export async function POST({ locals, request }) {
	if (!Helpers.hasPermission(locals))
		return Api.error('No tienes permisos para realizar esta acción', 403);

	const geminiApiKey = IaService.getApiKey('gemini');
	if (!geminiApiKey) return Api.error('No se ha configurado la API de Gemini', 500);

	const formData = await request.formData();
	const prompt = formData.get('prompt') as string;
	if (!prompt) return Api.error('No se ha proporcionado un prompt', 400);

	try {
		const repository = new IaRepository();

		const service = IaService.getServiceByModel('gemini');
		const iaResponse = await service.chat({
			prompts: [prompt],
			instructions: [
				'Eres un asistente útil que genera publicaciones de blog sobre lucha libre',
				'Escribe la respuesta directamente en HTML, sin etiquetas <html> ni <body> ni <h1> y sin <scripts> o <style> y sin usar negrita'
			],
			model: 'gemini-2.5-flash-lite'
		});

		if (!iaResponse.ok) {
			console.error('Error trying to generate post', { iaResponse });
			return Api.error('Error al generar el contenido: ' + iaResponse.status, 500);
		}

		await repository.create({
			service: 'gemini',
			model: 'gemini-2.5-flash-lite',
			request_id: iaResponse.request_id,
			status: iaResponse.finish_reason,
			total_time: iaResponse.total_time,
			total_tokens: iaResponse.total_tokens
		});

		const content = iaResponse.text;
		if (!content || content.length <= 0) return Api.error('No se ha generado contenido', 500);
		return Api.response({ text: content }, 200);
	} catch (error) {
		console.error('Error trying to generate post', { error });
		return Api.error('Error al generar el contenido', 500);
	}
}
