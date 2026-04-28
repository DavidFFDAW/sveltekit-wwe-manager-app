import { GROQ_API_KEY } from '$env/static/private';
import type { GroqResponse, IaStandardRequest, IaStandardResponse } from '../types';

export const GroqService = {
    chat: async ({ prompts, instructions, model = 'llama-3.3-70b-versatile' }: IaStandardRequest) => {
        if (!GROQ_API_KEY) throw new Error('No se ha configurado la API de Groq');

        const messages = prompts.map((content) => ({
            role: 'user',
            content: content
        }));
        const instructs = instructions.map((instruction) => ({
            role: 'system',
            content: instruction
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
        const data = (await response.json()) as GroqResponse;
        if (data.error) {
            console.error('Error response from Groq API', { data });
            throw new Error(data.error.message || 'Error desconocido al comunicarse con Groq');
        }

        return {
            model: model,
            service: 'groq',
            ok: response.ok,
            request_id: data.id,
            status: response.status,
            text: data.choices[0].message.content,
			finish_reason: data.choices[0].finish_reason === 'stop' ? 'success' : 'error',
			total_time: data.usage.completion_time,
            total_tokens: data.usage.total_tokens
        } as IaStandardResponse;
    }
};
export default GroqService;
