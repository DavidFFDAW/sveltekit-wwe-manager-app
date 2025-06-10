export const prerender = false;
export const ssr = true;

const getPageRouteSlug = (route) => {
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
		userIsAdmin: isAdmin,
		path: url.pathname,
		isAdminPage: url.pathname.startsWith('/admin'),
		pageRouteSlug: getPageRouteSlug(url.pathname)
	};
};
