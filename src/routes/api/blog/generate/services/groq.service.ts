import { GROQ_API_KEY } from '$env/static/private';

export const groq = {
	chat: async (contents: string[], instructions: string[], model: string = 'llama-3.3-70b-versatile') => {
		if (!GROQ_API_KEY) throw new Error('No se ha configurado la API de Groq');

		const messages = contents.map((content) => ({
			role: 'user',
			content: content,
		}));
		const instructs = instructions.map((instruction) => ({
			role: 'system',
			content: instruction,
		}));

		const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${GROQ_API_KEY}`
			},
			body: JSON.stringify({
				model: model,
				messages: [...instructs, ...messages]
			})
		});
		const data = await response.json();

		return {
			ok: response.ok,
			status: response.status,
			data: data as GroqResponse,
			response,
		};
	}
};
