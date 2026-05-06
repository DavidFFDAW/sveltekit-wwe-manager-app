import { GEMINI_API_KEY, GROQ_API_KEY } from '$env/static/private';
import { GeminiService } from './gemini.service.js';
import { GroqService } from './groq.service.js';

export const IaService = {
	providersDict: {
		gemini: 'gemini-2.0-flash',
		"llama": 'llama-3.3-70b-versatile',
		"gpt-20": 'openai/gpt-oss-20b',
		"gpt-120": 'openai/gpt-oss-120b',
	} as Record<string, string>,

	grokProviders: ['llama', 'gpt-20', 'gpt-120'],

	isGrokProvider(model: string) {
		return this.grokProviders.includes(model);
	},
	isValidProvider(model: string) {
		return ['gemini', ...this.grokProviders].includes(model);
	},
	getApiKey(model: string): string {
		if (model === 'gemini') return GEMINI_API_KEY;
		if (this.grokProviders.includes(model)) return GROQ_API_KEY;
		return '';
	},
	getModelByProvider(provider: string) {
		if (!(provider in this.providersDict)) throw new Error('Proveedor no soportado');
		return this.providersDict[provider];
	},
	getServiceByModel(provider: string) {
		if (provider === 'gemini') return GeminiService;
		if (this.grokProviders.includes(provider)) return GroqService;
		throw new Error('Proveedor no soportado');
	},
	getAvailableModels() {
		return Object.keys(this.providersDict);
	},
	parseJson(text: string) {
		return text.trim()
			.replace(/```json\n{\n/g, '{')
			.replace(/\n}\n/g, '}')
			.replace(/```json\n?/g, '')
			.replace(/```$/g, '')
			.replace(/\n?```/g, '')
			.replace(/^```\n?/g, '')
			.replace(/\n?```$/g, '')
			.replace(/\n/g, "")
			.replace(/\t/g, '');
	}
};
export default IaService;
