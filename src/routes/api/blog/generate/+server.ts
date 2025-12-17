import { GEMINI_API_KEY } from '$env/static/private';
import { Api, Helpers } from '$lib/server/server.helpers.js';

export async function POST({ locals, request }) {
	if (!Helpers.hasPermission(locals))
		return Api.error('No tienes permisos para realizar esta acción', 403);

	if (!GEMINI_API_KEY) return Api.error('No se ha configurado la API de Gemini', 500);
	const formData = await request.formData();
	const prompt = formData.get('prompt') as string;
	if (!prompt) return Api.error('No se ha proporcionado un prompt', 400);

	const model = 'gemini-2.5-flash-lite';
	const response = await fetch(
		`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-goog-api-key': GEMINI_API_KEY
			},
			body: JSON.stringify({
				contents: [
					{
						parts: [{ text: prompt }]
					}
				]
			})
		}
	);
	const responseJson = await response.json();
	if (!response.ok) {
		console.error('Error trying to generate post', { response });
		return Api.error('Error al generar el contenido: ' + responseJson.error.status, 500);
	}

	const content = responseJson.candidates[0];
	if (content.length <= 0) return Api.error('No se ha generado contenido', 500);

	const text = content.parts.map((part: { text: string }) => part.text).join('');
	if (!text) return Api.error('Error al generar el contenido', 500);

	return Api.response({ content, text }, 200);
}
