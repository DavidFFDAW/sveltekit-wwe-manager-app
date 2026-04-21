import { GEMINI_API_KEY, GROQ_API_KEY } from '$env/static/private';

export default {
	isValidProvider(model: string) {
		return ['gemini', 'groq'].includes(model);
	},
	getApiKey(model: string): string | null { 
		if (model === 'gemini') return GEMINI_API_KEY;
		if (model === 'groq') return GROQ_API_KEY;
		return null;
	}
}