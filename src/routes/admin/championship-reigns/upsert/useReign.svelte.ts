export const useReign = (data: any) => {
    let currentStep = $state(0);
	let selectedChampionshipId = $state(data.reign?.championship_id || null);
	let selectedChampionship = $derived(
		data.championships.find((c: any) => c.id === selectedChampionshipId)
	);
	let selectedWrestlerId = $state(data.reign?.wrestler_id || null);
    
    return {
        ...data,
        currentStep,
        selectedChampionshipId,
        selectedChampionship,
        selectedWrestlerId,
        nextStep: () => {
            console.log('aaaaaaaaaaaaaaaaaaaa');            
            currentStep++;
        },
    }
}