export const load = ({ url }) => {
	const adminMainRoute = '/' + (url.pathname.split('/')[2] || 'admin');
	const adminPreRoute = '/' + url.pathname.split('/').slice(2, 4).join('/');

	return {
		adminMainRoute,
		adminPreRoute,
		metas: {
			robots: 'noindex, nofollow'
		}
	};
};
