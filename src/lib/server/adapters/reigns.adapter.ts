export const ReignsAdapter = {
	getCommonDatas: (form: FormData) => {
		const type = form.get('reign-type');
		const lostDate = form.get('lost_date') ? new Date(form.get('lost_date') as string) : null;

		const baseDatas: Record<string, any> = {
			type: type ? (type as string) : 'single',
			championship: {
				id: Number(form.get('selected-championship-reign-resource-id')),
				name: form.get('selected-championship-reign-resource-name') as string
			},
			wrestler: {
				id: Number(form.get('selected-wrestler-reign-resource-id')),
				name: form.get('selected-wrestler-reign-resource-name') as string
			},
			team: {
				id: Number(form.get('selected-team-reign-resource-id')),
				members: form.getAll('team-members[]'),
				wrestler: form.get('team-wrestler-champion')
					? Number(form.get('team-wrestler-champion'))
					: null,
				partner: form.get('team-wrestler-partner')
					? Number(form.get('team-wrestler-partner'))
					: null
			},
			no_team: {
				members: {
					ids: form.getAll('team-single-member-selector-id[]'),
					names: form.getAll('team-single-member-selector-name[]')
				}
			},
			days: form.get('days') ? Number(form.get('days')) : 0,
			current: lostDate ? false : true,
			show_won: form.get('show_won'),
			victory_way: form.get('victory_way') || 'Pinfall',
			date_won: new Date(form.get('won_date') as string),
			date_lost: lostDate
		};

		return baseDatas;
	}
};
