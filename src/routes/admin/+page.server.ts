import { redirect } from '@sveltejs/kit';

export const ssr = true;
export const csr = false;

export const load = async () => {
	throw redirect(302, '/admin/dashboard');
};
