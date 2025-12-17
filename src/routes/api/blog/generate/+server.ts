import { GEMINI_API_KEY } from '$env/static/private';
import { Api, Helpers } from '$lib/server/server.helpers.js';

export async function POST({ locals, request }) {
	if (!Helpers.hasPermission(locals))
		return Api.error('No tienes permisos para realizar esta acción', 403);

	if (!GEMINI_API_KEY) return Api.error('No se ha configurado la API de Gemini', 500);
	const formData = await request.formData();
	const prompt = formData.get('prompt') as string;
	if (!prompt) return Api.error('No se ha proporcionado un prompt', 400);

	const model = 'gemini-2.0-flash';
	const response = await fetch(
		`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
		{
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				contents: [
					{
						parts: [{ text: prompt }]
					}
				]
			})
		}
	);
	if (!response.ok) return Api.error('Error al generar el contenido', 500);

	const data = await response.json();
	const content = data.candidates[0].content;
	if (!content) return Api.error('Error al generar el contenido', 500);

	const text = content.parts.map((part: { text: string }) => part.text).join('');
	if (!text) return Api.error('Error al generar el contenido', 500);

	return Api.response({ content, text }, 200);
}
