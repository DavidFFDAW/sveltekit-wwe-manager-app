export const WrestlerConstants = {
	statuses: [
		{ label: 'Activo', value: 'active' },
		{ label: 'Inactivo', value: 'not-active' },
		{ label: 'Despedido', value: 'released' },
		{ label: 'Lesionado', value: 'injured' },
		{ label: 'Part-time', value: 'semi-active' },
		{ label: 'Retirado', value: 'retired' },
		{ label: 'Manager', value: 'manager' },
		{ label: 'Leyenda', value: 'legend' }
	],
	statusDict: {
		active: 'Activo',
		'not-active': 'Inactivo',
		released: 'Despedido',
		injured: 'Lesionado',
		'semi-active': 'Part timer',
		retired: 'Retirado',
		manager: 'Manager',
		legend: 'Leyenda'
	} as Record<string, string>,
	genders: [
		{ label: 'Hombre', value: 'M' },
		{ label: 'Mujer', value: 'F' }
	],
	kayfabeStatuses: [
		{ label: 'Heel', value: 'heel' },
		{ label: 'Face', value: 'face' },
		{ label: 'Neutral', value: 'neutral' }
	]
};
