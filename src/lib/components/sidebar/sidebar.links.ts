export type SidebarLink = {
	url: string;
	label: string;
	icon: string;
	equals: boolean;
};

export const SidebarLinks: SidebarLink[] = [
	{
		url: '/admin/dashboard',
		label: 'Dashboard',
		icon: 'speedometer',
		equals: true
	},
	{
		url: '/admin/blog',
		label: 'Blog',
		icon: 'book',
		equals: false
	},
	{
		url: '/admin/blog/create',
		label: 'Crear post',
		icon: 'file-plus',
		equals: false
	},
	{
		url: '/admin/wrestlers',
		label: 'Luchadores',
		icon: 'person',
		equals: false
	},
	{
		url: '/admin/championships',
		label: 'Campeonatos',
		icon: 'trophy',
		equals: false
	},
	{
		url: '/admin/reigns',
		label: 'Reinados',
		icon: 'trophy-fill',
		equals: false
	},
	{
		url: '/admin/reigns/defences/update',
		label: 'Defensas titulares',
		icon: 'shield-fill',
		equals: false
	},
	{
		url: '/admin/reigns/create',
		label: 'Crear reinado',
		icon: 'trophy-fill',
		equals: false
	},
	{
		url: '/admin/teams',
		label: 'Equipos',
		icon: 'people',
		equals: false
	},
	{
		url: '/admin/users',
		label: 'Usuarios',
		icon: 'person-gear',
		equals: false
	},
	{
		url: '/admin/ppvs',
		label: 'PPVs',
		icon: 'calendar',
		equals: false
	},
	{
		url: '/admin/matchcards',
		label: 'Match cards',
		icon: 'card-list',
		equals: false
	},
	{
		url: '/admin/money-in-the-bank',
		label: 'MITB',
		icon: 'briefcase',
		equals: false
	},
	{
		url: '/admin/rumble',
		label: 'Rumble',
		icon: 'card-list',
		equals: false
	},
	{
		url: '/admin/injuries',
		label: 'Lesiones',
		icon: 'exclamation-diamond-fill',
		equals: false
	},
	{
		url: '/admin/image-editor',
		label: 'Editar imagen',
		icon: 'image',
		equals: false
	},
	{
		url: '/admin/cronjobs',
		label: 'Cronjobs',
		icon: 'clock',
		equals: false
	},
	{
		url: '/admin/subscriptions',
		label: 'Suscripciones',
		icon: 'credit-card',
		equals: false
	},
	{
		url: '/admin/push',
		label: 'Push',
		icon: 'send',
		equals: false
	},
	{
		url: '/admin/draft',
		label: 'Draft',
		icon: 'grid-fill',
		equals: false
	}
];

export const SidebarGroups = [
	{ label: 'General', paths: ['dashboard', 'blog', 'blog/create'] },
	{
		label: 'Roster',
		paths: [
			'wrestlers',
			'teams',
			'championships',
			'reigns',
			'reigns/defences/update',
			'reigns/create',
			'injuries',
			'draft'
		]
	},
	{ label: 'Eventos', paths: ['ppvs', 'matchcards', 'money-in-the-bank', 'rumble'] },
	{
		label: 'Administraci\u00f3n',
		paths: ['users', 'image-editor', 'cronjobs', 'subscriptions', 'push']
	}
].map(({ label, paths }) => ({
	label,
	links: paths.flatMap((path) => SidebarLinks.filter((link) => link.url === `/admin/${path}`))
}));
