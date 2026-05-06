import { IaRepository } from '$lib/server/dao/repositories/ia.repository.js';
import { Api, Helpers } from '$lib/server/server.helpers.js';
import IaService from '../services/ia.service.js';

export async function POST({ locals, request }) {
	if (!Helpers.hasPermission(locals))
		return Api.error('No tienes permisos para realizar esta acción', 403);

	const provider = 'groq';
	const groqApiKey = IaService.getApiKey(provider);
	if (!groqApiKey) return Api.error('No se ha configurado la API de Groq', 500);

	const formData = await request.formData();
	const prompt = formData.get('prompt') as string;
	if (!prompt) return Api.error('No se ha proporcionado un prompt', 400);

	try {
		const logs = new IaRepository();
		const service = IaService.getServiceByModel(provider);

		const groqResponse = await service.chat({
			prompts: [prompt],
			instructions: [
				'Eres un asistente útil que genera publicaciones de blog sobre lucha libre',
				'Escribe la respuesta directamente en HTML, sin etiquetas <html> ni <body> ni <h1> y sin <scripts> o <style>. Solo contenido'
			],
			model: 'llama-3.3-70b-versatile'
		});

		if (!groqResponse.ok) {
			console.error('Error trying to generate post', { groqResponse });
			return Api.error('Error al generar el contenido: ' + groqResponse.status, 500);
		}

		const message = IaService.parseJson(groqResponse.text);
		await logs.register({
			service: 'groq',
			model: 'llama-3.3-70b-versatile',
			request_id: groqResponse.request_id,
			status: groqResponse.finish_reason,
			total_time: groqResponse.total_time,
			total_tokens: groqResponse.total_tokens
		});

		if (message.length <= 0) return Api.error('No se ha generado contenido', 500);
		return Api.response({ text: message }, 200);
	} catch (error) {
		console.error('Error trying to generate post', { error });
		return Api.error('Error al generar el contenido', 500);
	}
}
