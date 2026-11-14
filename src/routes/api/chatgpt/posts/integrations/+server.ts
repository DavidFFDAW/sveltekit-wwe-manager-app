export async function POST({ request }) {
    // const req = await request.json();
    // return successful response
    return new Response(JSON.stringify({ post_id: 123, message: 'Integration POST endpoint' }), {
        status: 201,
        headers: {
            'Content-Type': 'application/json'
        }
    });
}