export const prerender = false;
export const ssr = true;

const getPageRouteSlug = (route: string) => {
	if (!route) return 'non-page';
	if (route === '/') return 'home';
	return route
		.slice(1)
		.replace(/\//gi, '-')
		.replace(/[()$?&`'"]/gi, '');
};

const getBreadcrumbs = (pathname: string): { name: string; href: string }[] => {
	const pathSegments = pathname
		.split('/')
		.filter(Boolean)
		.map((segment, index, array) => {
			const href = '/' + array.slice(0, index + 1).join('/');
			const name = segment.replace(/-/g, ' ');
			return { name, href };
		});

	return [{ name: 'home', href: '/' }, ...pathSegments];
};

export const load = async ({ locals, url }) => {
	const storedUser = locals.user;
	const isAdmin = storedUser ? ['admin', 'superadmin'].includes(storedUser.role) : false;

	return {
		path: url.pathname,
		userIsAdmin: isAdmin,
		user: storedUser || null,
		breadcrumbs: getBreadcrumbs(url.pathname),
		pageRouteSlug: getPageRouteSlug(url.pathname),
		isAdminPage: url.pathname.startsWith('/admin')
	};
};
