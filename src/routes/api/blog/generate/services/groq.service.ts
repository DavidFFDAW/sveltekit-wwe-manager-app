import { GROQ_API_KEY } from "$env/static/private"

export const groq = {
    chat: (messages: ChatMessages[], model: string = 'llama-3.3-70b-versatile') => {
        return fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: model,
                messages: messages
            })
        });
    } 
}