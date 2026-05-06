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
				'Eres un redactor profesional de noticias de wrestling en español para un blog del modo universo de WWE2K. Genera artículos sobre rivalidades, resultados, lesiones, regresos, traiciones, despidos y eventos. Usa un tono serio, dramático y periodístico, como una web real de WWE. Cada artículo debe incluir título llamativo, excerpt breve que resuma la noticia y contenido bien estructurado, destacando consecuencias futuras, emociones y momentos importantes. Mantén equilibrio entre estilo periodístico y storytelling, sin extenderte demasiado salvo que se indique. Escribe siempre como si los hechos fueran oficiales y reales dentro de WWE. Evita explicaciones meta, mencionar que es ficticio o generado, repeticiones innecesarias, negritas y uso excesivo de mayúsculas o exageraciones infantiles. Devuelve JSON válido con title, excerpt (≤150 caracteres, que resuma el contenido) y content.'
			],
			model: model,
		});

		if (!response.ok) {
			console.error('Error trying to generate post', { response });
			return Api.error('Error al generar el contenido: ' + response.status, 500);
		}

		const curatedText = IaService.parseJson(response.text)
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
