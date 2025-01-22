// import { redirect } from '@sveltejs/kit';

export const load = async ({ cookies, locals }) => {
	const token = cookies.get('session');
	const user = locals.user;

	console.log('Admin layout', { token, user });

	if (!token && !user) {
		console.log('Admin layout redirecting to login');
		// throw redirect(306, '/login');
	}

	return { token };
};
