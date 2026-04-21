interface ChatMessages {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

interface GeminiCandidate {
	content: {
		parts: { text: string }[];
		role: 'model' | 'user' | 'assistant';
	};
	finishReason: 'STOP' | 'ERROR' | 'TIMEOUT';
	index: number;
}

interface GeminiPromptTokensDetails {
	modality: 'TEXT';
	tokenCount: number;
}

interface GeminiResponse {
	"candidates": GeminiCandidate[];
	"usageMetadata": {
		"promptTokenCount": number,
		"candidatesTokenCount": number,
		"totalTokenCount": number,
		"promptTokensDetails": GeminiPromptTokensDetails[];
		"thoughtsTokenCount": number;
	},
	"modelVersion": string;
	"responseId": string;
}

interface GrokChoices {
	"index": number;
	"message": {
	"role": string;
	"content": string;
	},
	"logprobs": null | any;
	"finish_reason": string;
}


interface GroqResponse {
  "id": string;
  "object": string;
  "created": number;
  "model": string;
  "choices": GrokChoices[];
  "usage": {
	  "queue_time": number;
    "prompt_tokens": number;
    "prompt_time": number;
    "completion_tokens": number;
    "completion_time": number;
	  "total_tokens": number;
	"total_time": number;
  },
  "system_fingerprint": string;
  "x_groq": { "id": string }
}
