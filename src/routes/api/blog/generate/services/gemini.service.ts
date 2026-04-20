import { GEMINI_API_KEY } from '$env/static/private';

export const gemini = {
	chat: (contents: string[], instructions: string[], model: string = 'gemini-2.5-flash-lite') => {
		if (!GEMINI_API_KEY) throw new Error('No se ha configurado la API de Groq');

		const parsedContents = contents.map((content) => ({
			parts: [{ text: content }]
		}));
		const instructionsContent = instructions.map((instruction) => ({
			parts: [{ text: instruction }]
		}));

		return fetch(
			`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'X-goog-api-key': GEMINI_API_KEY
				},
				body: JSON.stringify({
					contents: parsedContents,
					systemInstructions: instructionsContent
				})
			}
		);
	}
};
