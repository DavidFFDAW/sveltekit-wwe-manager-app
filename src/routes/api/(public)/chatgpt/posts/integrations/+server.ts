export function POST() {
    return new Response(
        JSON.stringify({
            post_id: 123, // Replace with actual post ID
            message: 'Integration created successfully',
        }),
        {
            status: 201,
            headers: {
                'Content-Type': 'application/json',
            },
        },
    );
}
