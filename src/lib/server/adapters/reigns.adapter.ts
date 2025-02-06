export const ReignsAdapter = {
	getCommonDatas: (form: FormData) => {
		const type = form.get('reign_type');
		const baseDatas: Record<string, any> = {
			type: type ? (type as string) : 'single',
			days: form.get('days') ? Number(form.get('days')) : 0,
			show_won: form.get('show_won'),
			victory_way: form.get('victory_way') || 'Pinfall',
			date_won: new Date(form.get('won_date') as string),
			date_lost: form.get('lost_date') ? new Date(form.get('lost_date') as string) : null,
			members: form.getAll('team-members[]')
		};
		if (type === 'team') {
			baseDatas['members'] = form.getAll('team-members[]');
		}
		if (type === 'no-team') {
			baseDatas['no_tam_members'] = {
				ids: form.getAll('team-single-member-selector-id[]'),
				names: form.getAll('team-single-member-selector-name[]')
			};
		}

		return baseDatas;
	}
};
