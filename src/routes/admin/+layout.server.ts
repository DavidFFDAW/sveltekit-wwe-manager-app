import { redirect } from '@sveltejs/kit';

export const load = async ({ cookies, locals }) => {
	const token = cookies.get('session');
	const user = locals.user;

	if (!token || !user) {
		throw redirect(302, '/login');
	}

	return { token };
};
