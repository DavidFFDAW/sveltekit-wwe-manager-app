import { page } from '$app/state';

export const SEOUtils = {
	getGeneralMetaTags: () => {
		return {
			title: 'WWE 2K Universo',
			description:
				'WWE 2K Universo es una web dedicada a la simulación de la WWE en el videojuego WWE 2K. Aquí podrás encontrar información sobre los luchadores, los eventos, los campeonatos y mucho más.',
			image: '/icons/versatile.png',
			url: page.url,
			canonical: page.url,
			themeColor: '#000000',
			keywords: 'wwe, manager, app, blog, posts',
			type: 'website',
			twitter: {
				card: 'summary_large_image',
				site: '@dfernandezdev',
				creator: '@dfernandezdev'
			},
			og: {
				site_name: 'WWE 2K Universo',
				locale: 'es_ES',
				type: 'website',
				image: {
					url: '/icons/versatile.png',
					alt: 'WWE 2K Universo'
				}
			}
		};
	}
};
