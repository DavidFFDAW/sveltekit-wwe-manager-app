type SidebarLink = {
	url: string;
	label: string;
	icon: string;
	equals: boolean;
	submenu?: SidebarLink[];
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
		equals: false,
		submenu: [
			{
				url: '/admin/blog',
				label: 'Posts',
				icon: 'file-text',
				equals: true
			},
			{
				url: '/admin/blog/create',
				label: 'Crear post',
				icon: 'file-plus',
				equals: true
			}
		]
	},
	{
		url: '/admin/wrestlers',
		label: 'Luchadores',
		icon: 'user',
		equals: false
	},
	{
		url: '/admin/championships',
		label: 'Campeonatos',
		icon: 'trophy',
		equals: false
	},
	{
		url: '/admin/championship-reigns',
		label: 'Reinados',
		icon: 'trophy-fill',
		equals: false,
		submenu: [
			{
				url: '/admin/championship-reigns/defences',
				label: 'Defensas',
				icon: 'shield-fill',
				equals: true
			},
			{
				url: '/admin/championship-reigns/create',
				label: 'Crear',
				icon: 'trophy-fill',
				equals: true
			}
		]
	},
	{
		url: '/admin/users',
		label: 'Users',
		icon: 'persons',
		equals: false
	},
	{
		url: '/admin/ppvs',
		label: 'PPVs',
		icon: 'calendar',
		equals: false
	},
	{
		url: '/admin/image-editor',
		label: 'Editar imagen',
		icon: 'image',
		equals: false
	}
];
