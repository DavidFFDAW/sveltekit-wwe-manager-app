export const prerender = false;
export const ssr = true;

const getPageRouteSlug = (route: string) => {
	if (!route) return 'non-page';
	if (route === '/') return 'home';
	return route
		.slice(1)
		.replace(/\//gi, '-')
		.replace(/[\(\)\$\?\&\`\'\"]/gi, '');
};

export const load = async ({ locals, url }) => {
	const storedUser = locals.user;
	const isAdmin = storedUser ? ['admin', 'superadmin'].includes(storedUser.role) : false;

	return {
		path: url.pathname,
		userIsAdmin: isAdmin,
		pageRouteSlug: getPageRouteSlug(url.pathname),
		isAdminPage: url.pathname.startsWith('/admin')
	};
};
