type DashboardLink = {
	url: string;
	label: string;
	image?: string;
	background?: string;
	equals: boolean;
	testb?: string;
};

export const DashboardLinks: DashboardLink[] = [
	{
		url: '/admin/blog',
		label: 'Blog',
		image: 'https://davidfernandezdeveloper.es/2k/images/the-rock.webp',
		testb: 'https://culturedvultures.com/wp-content/uploads/2019/05/The-Miz-WWE.jpg',
		equals: false
	},
	{
		url: '/admin/wrestlers',
		label: 'Luchadores',
		image: 'https://davidfernandezdeveloper.es/2k/images/john-cena.webp',
		testb: 'https://dnm.nflximg.net/api/v6/2DuQlx0fM4wd1nzqm5BFBi6ILa8/AAAAQXqRK3CKVNvbSjPuHMEC6Yw2QKraG_IxNwrubg9t9r1fWSHIVds3YEbkEEG_Slpv-U2RmzznF47YnV-FYgY-iMz2XswZOtBVFrn5IfqT5Na05PnzA13VAi9RFTUAKBIxWnIQuxawKawZFWhBlOnb9uId.jpg?r=9be',
		equals: false
	},
	{
		url: '/admin/championships',
		label: 'Campeonatos',
		image: 'https://davidfernandezdeveloper.es/2k/images/randy-orton.webp',
		testb: 'https://external-preview.redd.it/nobody-was-backstage-to-celebrate-wwe-title-win-champion-v0-pck0keJQy0skWj4hvBOy3ngDrSVfvprHw4p-2FHXCg8.jpeg?width=640&crop=smart&auto=webp&s=460d461e121d7e426ca5c51a3270e155fc60adf8',
		equals: false
	},
	{
		url: '/admin/championship-reigns',
		label: 'Reinados',
		image: 'https://davidfernandezdeveloper.es/2k/images/roman-reigns.webp',
		testb: 'https://img.solowrestling.com/images/139/139513-cody-rhodes-rr.jpg',
		equals: false
	},
	{
		url: '/admin/teams',
		label: 'Equipos',
		image: 'https://davidfernandezdeveloper.es/2k/images/bret-hart.webp',
		testb: 'https://www.wwe.com/f/styles/wwe_large/public/all/2019/03/045_KOTR_06191994_0066--ab67f347fcea090e18fbb6d62d56f82d.jpg',
		equals: false
	},
	{
		url: '/admin/users',
		label: 'Usuarios',
		image: 'https://davidfernandezdeveloper.es/2k/images/shawn-michaels.webp',
		testb: 'https://www.wwe.com/f/styles/wwe_large/public/article/thumb/2013/04/20130409_LIGHT_raw_crowd_CandL.jpg',
		equals: false
	},
	{
		url: '/admin/image-editor',
		label: 'Imagenes',
		image: 'https://davidfernandezdeveloper.es/2k/images/kurt-angle.webp',
		testb: 'https://e0.365dm.com/16/08/2048x1152/kurt-angle-wwe-wrestling_3757143.png?20160803135501',
		equals: false
	},
	{
		url: '/admin/cronjobs',
		label: 'Cronjobs',
		image: 'https://davidfernandezdeveloper.es/2k/images/aj-styles.webp',
		testb: 'https://e0.365dm.com/17/11/1600x900/skysports-aj-styles-smackdown-wwe-champion_4150110.jpg?20171108105700',
		equals: false
	},
	{
		url: '/admin/subscriptions',
		label: 'Suscripciones',
		image: 'https://davidfernandezdeveloper.es/2k/images/steve-austin.webp',
		testb: 'https://deadline.com/wp-content/uploads/2025/09/IMG_4518-copy.png?w=681&h=383&crop=1',
		equals: false
	},
	{
		url: '/admin/draft',
		label: 'Draft',
		image: 'https://davidfernandezdeveloper.es/2k/images/triple-h.webp',
		testb: 'https://www.wrestlerant.com/uploads/5/7/3/2/5732092/nick-aldis-and-adam-pearce_orig.jpg',
		equals: false
	},
	{
		url: '/admin/injuries',
		label: 'Lesiones',
		image: 'https://davidfernandezdeveloper.es/2k/images/bron-breakker.webp',
		testb: 'https://metro.co.uk/wp-content/uploads/2024/12/SEI_233451368-8f64.jpg?quality=90&strip=all&w=646',
		equals: false
	},
	{
		url: '/admin/matchcards',
		label: 'Match Cards',
		image: 'https://davidfernandezdeveloper.es/2k/images/logan-paul.webp',
		testb: 'https://www.wwe.com/f/styles/wwe_16_9_xl/public/all/2020/04/WWEBackdrops_Ring--55000519632927d93bfe17d9a8755fe1.jpg',
		equals: false
	},
	{
		url: '/admin/rivalries',
		label: 'Rivalidades',
		image: 'https://davidfernandezdeveloper.es/2k/images/finn-balor.webp',
		testb: 'https://i.redd.it/rpht47o3zzn61.jpg',
		equals: false
	},
	{
		url: '/admin/export',
		label: 'Exportar datos',
		image: 'https://davidfernandezdeveloper.es/2k/images/hulk-hogan.webp',
		testb: 'https://www.hollywoodreporter.com/wp-content/uploads/2023/06/BACK_05062023HM_23052.jpg?w=2000&h=1126&crop=1',
		equals: false
	},
	{
		url: '/admin/ppvs',
		label: 'PPVs',
		background:
			'https://www.wwe.com/f/styles/gallery_img_l/public/all/2024/01/131_RR_01272024GD_37295--a0647e43afa91c64976613f63e4c387c.jpg',
			// 'https://www.wwe.com/f/styles/wwe_16_9_xl/public/all/2020/04/WWEBackdrops_Ring--55000519632927d93bfe17d9a8755fe1.jpg',
		testb: 'https://static0.thesportsterimages.com/wordpress/wp-content/uploads/2022/05/WrestleMania-33-Stage.jpg?q=50&fit=crop&w=825&dpr=1.5',
		equals: false
	}
];
