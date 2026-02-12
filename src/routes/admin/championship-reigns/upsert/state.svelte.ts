export const setReignsUpsertState = (data: any) => {
	let currentStep = $state(1);
	let currentTagType = $state<'team' | 'manual'>('team');
	let selectedChampionshipId = $state(data.reign?.championship_id || null);
	let selectedChampionship = $derived(data.championshipsMap.get(selectedChampionshipId || 0));
	let isTagTeam = $derived(selectedChampionship?.tag || false);
	let selectedWrestlerId = $state(data.reign?.wrestler_id || null);
	let selectedWrestler = $derived(data.wrestlersMap.get(selectedWrestlerId || 0));
	let selectedTeamId = $state(data.reign?.team_id || null);
	let selectedTeam = $derived(
		data.finalParsedTeams.find((team: any) => team.id === selectedTeamId) || null
	);
	let maxSteps = $derived(isTagTeam ? 4 : 3);
	let members = $state(data.members || []);
	let realMembers = $derived.by(() => {
		if (currentTagType === 'manual')
			return members.map((memberId: any) => data.wrestlersMap.get(memberId)).filter(Boolean);
		if (members.length < 2 && selectedTeam?.members.length === 2)
			return selectedTeam?.members || [];
		return selectedTeam?.members.filter((member: any) => members.includes(member.id)) || [];
	});

	$effect(() => {
		if (members.length > 2) members = members.slice(0, 2);
	});

	const nextStep = () => {
		if (currentStep < maxSteps) {
			currentStep++;
		}
	};

	const previousStep = () => {
		if (currentStep > 1) {
			currentStep--;
		}
	};

	const handleTeamSelection = (type: 'manual' | 'team') => (event: Event) => {
		currentTagType = type;
		if (type === 'manual') nextStep();
	};

	return {
		get currentStep() {
			return currentStep;
		},
		get currentTagType() {
			return currentTagType;
		},
		get selectedChampionshipId() {
			return selectedChampionshipId;
		},
		get selectedChampionship() {
			return selectedChampionship;
		},
		get isTagTeam() {
			return isTagTeam;
		},
		get selectedWrestlerId() {
			return selectedWrestlerId;
		},
		get selectedWrestler() {
			return selectedWrestler;
		},
		get selectedTeamId() {
			return selectedTeamId;
		},
		get selectedTeam() {
			return selectedTeam;
		},
		get maxSteps() {
			return maxSteps;
		},
		get members() {
			return members;
		},
		get realMembers() {
			return realMembers;
		},
		// Setters
		set currentStep(value: number) {
			currentStep = value;
		},
		set currentTagType(value: 'team' | 'manual') {
			currentTagType = value;
		},
		set selectedChampionshipId(value: number | null) {
			selectedChampionshipId = value;
		},
		set selectedWrestlerId(value: number | null) {
			selectedWrestlerId = value;
		},
		set selectedTeamId(value: number | null) {
			selectedTeamId = value;
		},
		set members(value: any[]) {
			members = value;
		},
		// Actions
		nextStep,
		previousStep,
		handleTeamSelection
	};
};
