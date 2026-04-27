export interface ChatMessages {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

export interface GeminiCandidate {
    content: {
        parts: { text: string }[];
        role: 'model' | 'user' | 'assistant';
    };
    finishReason: 'STOP' | 'ERROR' | 'TIMEOUT';
    index: number;
}

export interface GeminiPromptTokensDetails {
    modality: 'TEXT';
    tokenCount: number;
}

export interface GeminiResponse {
    candidates: GeminiCandidate[];
    usageMetadata: {
        promptTokenCount: number;
        candidatesTokenCount: number;
        totalTokenCount: number;
        promptTokensDetails: GeminiPromptTokensDetails[];
        thoughtsTokenCount: number;
    };
    modelVersion: string;
    responseId: string;
    error?: {
        code: number;
        message: string;
        status: string;
    };
}

export interface GrokChoices {
    index: number;
    message: {
        role: string;
        content: string;
    };
    logprobs: null | any;
    finish_reason: string;
}

export interface GroqResponse {
    id: string;
    object: string;
    created: number;
    model: string;
    choices: GrokChoices[];
    usage: {
        queue_time: number;
        prompt_tokens: number;
        prompt_time: number;
        completion_tokens: number;
        completion_time: number;
        total_tokens: number;
        total_time: number;
    };
    system_fingerprint: string;
    x_groq: { id: string };
    error?: {
        message: string;
        type: string;
        code: string;
    };
}

export interface IaStandardRequest {
    prompts: string[];
    instructions: string[];
    model: string;
}
export interface IaStandardResponse {
    ok: boolean;
    status: number;
    text: string;
    service: string;
    model: string;
    request_id: string;
    finish_reason: 'success' | 'error';
    total_time: number;
    total_tokens: number;
}

export interface IaProviderChat {
    chat: (request: IaStandardRequest) => Promise<IaStandardResponse>;
}
