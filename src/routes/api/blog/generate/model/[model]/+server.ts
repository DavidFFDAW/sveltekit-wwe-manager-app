import IaService from '../../services/ia.service.js';
import { Api, Helpers } from '$lib/server/server.helpers.js';
// import { IaRepository } from '$lib/server/dao/repositories/ia.repository.js';

export async function POST({ locals, request, params }) {
	if (!Helpers.hasPermission(locals))
		return Api.error('No tienes permisos para realizar esta acción', 403);
	
	const model = params.model;
	if (!model) return Api.error('No se ha especificado un modelo', 400);
	if (!IaService.isValidProvider(model)) return Api.error('El modelo especificado no es válido', 400);

	const apiKey = IaService.getApiKey(model);
	if (!apiKey) return Api.error(`No se ha configurado la API de ${model}`, 500);

	const formData = await request.formData();
	const prompt = formData.get('prompt') as string;
	if (!prompt) return Api.error('No se ha proporcionado un prompt', 400);
	
	return Api.error('Todavía no se puede usar este endpoint...', 501);
	// try {
	// } catch (error) {
	// 	console.error('Error trying to generate post', { error });
	// 	return Api.error('Error al generar el contenido', 500);
	// }
}
