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

const getPageTitle = (pathname: string, route: string | null): string => {
	if (pathname === '/') return 'Home';
	if (!route) return 'Unknown';

	const cleanedRoute = route
		.replace(/(\[.*?\]|\(.*?\)|[\[\]\(\)\+])/g, '')
		.replace(/\/+/g, '/')
		.replace(/\/$/, '')
		.split('/')
		.filter(Boolean);
	const tr = cleanedRoute.join(' ');

	return tr.charAt(0).toUpperCase() + tr.slice(1) || 'Page';
};

export const load = async ({ locals, url, route, request }) => {
	const storedUser = locals.user;
	const isAdmin = storedUser ? ['admin', 'superadmin'].includes(storedUser.role) : false;

	return {
		pagetitle: getPageTitle(url.pathname, route.id),
		path: url.pathname,
		userIsAdmin: isAdmin,
		user: storedUser || null,
		canonical: (url.origin + url.pathname).replace(/\/$/g, ''),
		referer: request.headers.get('referer') || null,
		breadcrumbs: getBreadcrumbs(url.pathname),
		pageRouteSlug: getPageRouteSlug(url.pathname),
		isAdminPage: url.pathname.startsWith('/admin')
	};
};
