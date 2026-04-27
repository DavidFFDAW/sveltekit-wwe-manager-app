import { GEMINI_API_KEY } from '$env/static/private';
import type { GeminiResponse, IaStandardRequest, IaStandardResponse } from '../types';

export const GeminiService = {
    chat: async ({ prompts, instructions, model = 'gemini-2.5-flash-lite' }: IaStandardRequest) => {
        if (!GEMINI_API_KEY) throw new Error('No se ha configurado la API de Groq');

        const parsedContents = prompts.map((content) => ({
            role: 'user',
            parts: { text: content }
        }));
        const instructionsContent = instructions.map((instruction) => ({
            role: 'system',
            parts: { text: instruction }
        }));

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-goog-api-key': GEMINI_API_KEY
                },
                body: JSON.stringify({
                    contents: [...instructionsContent, ...parsedContents]
                })
            }
        );
        const data = (await response.json()) as GeminiResponse;
        if (!response.ok && data.error) {
            console.error('Error response from Gemini API', { data });
            throw new Error(data.error.message || 'Error desconocido al comunicarse con Gemini');
        }

        return {
            ok: response.ok,
            status: response.status,
            text: data.candidates[0].content.parts.map((part: { text: string }) => part.text).join(''),
            service: 'gemini',
            model: model,
            request_id: data.responseId,
            finish_reason: data.candidates[0].finishReason === 'STOP' ? 'success' : 'error',
            total_tokens: data.usageMetadata.totalTokenCount,
            total_time: 0
        } as IaStandardResponse;
    }
};
