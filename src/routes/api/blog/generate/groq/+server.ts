import { GEMINI_API_KEY, GROQ_API_KEY } from '$env/static/private';
import { Api, Helpers } from '$lib/server/server.helpers.js';
import { groq } from '../services/groq.service.js';

export async function POST({ locals, request }) {
    if (!Helpers.hasPermission(locals))
        return Api.error('No tienes permisos para realizar esta acción', 403);
    if (!GROQ_API_KEY) return Api.error('No se ha configurado la API de Groq', 500);

    const formData = await request.formData();
    const prompt = formData.get('prompt') as string;
    if (!prompt) return Api.error('No se ha proporcionado un prompt', 400);
    
    try {
    const groqResponse = await groq.chat([
        { role: 'system', content: 'Eres un asistente útil que genera publicaciones de blog sobre lucha libre.' },
        { role: 'system', content: 'Escribe la respuesta directamente en HTML, sin etiquetas <html> ni <body> ni <h1> y sin <scripts> o <style>. Solo contenido' },
        { role: 'user', content: prompt }
    ], 'llama-3.3-70b-versatile');

    const response = await groqResponse.json();
    if (!groqResponse.ok) {
        console.error('Error trying to generate post', { response });
        return Api.error('Error al generar el contenido: ' + response.error.status, 500);
    }

    const content = response.choices[0].message;
    if (content.length <= 0) return Api.error('No se ha generado contenido', 500);
    return Api.response({ response, content, text: content.content }, 200);
    } catch (error) {
        console.error('Error trying to generate post', { error });
        return Api.error('Error al generar el contenido', 500);
    }
}
