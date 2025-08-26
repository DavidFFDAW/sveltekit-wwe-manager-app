type DashboardLink = {
	url: string;
	label: string;
	image?: string;
	background?: string;
	equals: boolean;
};

export const DashboardLinks: DashboardLink[] = [
	{
		url: '/admin/blog',
		label: 'Blog',
		image: 'https://davidfernandezdeveloper.es/2k/images/the-rock.webp',
		equals: false
	},
	{
		url: '/admin/wrestlers',
		label: 'Luchadores',
		image: 'https://davidfernandezdeveloper.es/2k/images/john-cena.webp',
		equals: false
	},
	{
		url: '/admin/championships',
		label: 'Campeonatos',
		image: 'https://davidfernandezdeveloper.es/2k/images/randy-orton.webp',
		equals: false
	},
	{
		url: '/admin/championship-reigns',
		label: 'Reinados',
		image: 'https://davidfernandezdeveloper.es/2k/images/roman-reigns.webp',
		equals: false
	},
	{
		url: '/admin/teams',
		label: 'Equipos',
		image: 'https://davidfernandezdeveloper.es/2k/images/bret-hart.webp',
		equals: false
	},
	{
		url: '/admin/users',
		label: 'Usuarios',
		image: 'https://davidfernandezdeveloper.es/2k/images/shawn-michaels.webp',
		equals: false
	},
	{
		url: '/admin/image-editor',
		label: 'Imagenes',
		image: 'https://davidfernandezdeveloper.es/2k/images/kurt-angle.webp',
		equals: false
	},
	{
		url: '/admin/cronjobs',
		label: 'Cronjobs',
		image: 'https://davidfernandezdeveloper.es/2k/images/aj-styles.webp',
		equals: false
	},
	{
		url: '/admin/subscriptions',
		label: 'Suscripciones',
		image: 'https://davidfernandezdeveloper.es/2k/images/steve-austin.webp',
		equals: false
	},
	{
		url: '/admin/draft',
		label: 'Draft',
		image: 'https://davidfernandezdeveloper.es/2k/images/triple-h.webp',
		equals: false
	},
	{
		url: '/admin/injuries',
		label: 'Lesiones',
		image: 'https://davidfernandezdeveloper.es/2k/images/bron-breakker.webp',
		equals: false
	},
	{
		url: '/admin/matchcards',
		label: 'Match Cards',
		image: 'https://davidfernandezdeveloper.es/2k/images/logan-paul.webp',
		equals: false
	},
	{
		url: '/admin/rivalries',
		label: 'Rivalidades',
		image: 'https://davidfernandezdeveloper.es/2k/images/finn-balor.webp',
		equals: false
	},
	{
		url: '/admin/export',
		label: 'Exportar datos',
		image: 'https://davidfernandezdeveloper.es/2k/images/hulk-hogan.webp',
		equals: false
	},
	{
		url: '/admin/ppvs',
		label: 'PPVs',
		background:
			'https://www.wwe.com/f/styles/gallery_img_l/public/all/2024/01/131_RR_01272024GD_37295--a0647e43afa91c64976613f63e4c387c.jpg',
		equals: false
	}
];
