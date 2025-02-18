import type {
	UpserReignWrestler,
	UpserReignChampionship
} from './../../interfaces/reigns.interfaces';
import { derived, writable } from 'svelte/store';
import type { UpsertReign, UpsertReignTeams } from '../../interfaces/reigns.interfaces';
import type { UpsertReignState } from './interfaces';

const currentStep = writable(1);
const selectedChampionshipID = writable<number | null>(null);
const selectedWrestlerID = writable<number | null>(null);

const reign = writable<UpsertReign>({} as UpsertReign);
const selectedChampionship = writable<UpsertReign['Championship'] | null>(null);
const selectedWrestler = writable<UpsertReign['Wrestler'] | null>(null);
const championships = writable<UpserReignChampionship[]>([]);
const wrestlers = writable<UpserReignWrestler[]>([]);
const teams = writable<UpsertReignTeams[]>([]);
const titleType = writable<string>('single'); // 'individual', 'equipo', 'parejaSinEquipo'

export function useUpsertReign(initialData?: UpsertReignState) {
	if (initialData) {
		championships.set(initialData.championships);
		wrestlers.set(initialData.wrestlers);
		teams.set(initialData.teams);

		if (initialData.reign) {
			reign.set(initialData.reign);
			const reignViewType = initialData.reign.Championship.tag
				? initialData.reign.team_id
					? 'team'
					: 'no-team'
				: 'single';
			titleType.set(reignViewType);
			selectedChampionshipID.set(initialData.reign.championship_id);
			selectedWrestlerID.set(initialData.reign.wrestler_id);
		}
	}

	// Luchadores filtrados según el título seleccionado
	const filteredWrestlers = derived(
		[selectedChampionship, wrestlers],
		([$selectedTitle, $wrestlers]) => {
			if (!$selectedTitle) return $wrestlers;
			return $wrestlers.filter((wrestler) => wrestler.gender === $selectedTitle.gender);
		}
	);

	// Funciones para actualizar el estado
	function nextStep() {
		currentStep.update((n) => n + 1);
	}

	function prevStep() {
		currentStep.update((n) => n - 1);
	}

	// Retornar el estado y las funciones
	return {
		step: currentStep,
		wrestlers: filteredWrestlers, // Usar luchadores filtrados
		titleType,
		nextStep,
		prevStep
	};
}
