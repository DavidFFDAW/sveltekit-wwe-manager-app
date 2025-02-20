<script lang="ts">
	import { browser } from '$app/environment';
	import Box from '$lib/components/box/box.svelte';
	import Input from '$lib/components/forms/inputs/input.svelte';
	import { Toast } from '$lib/utils/toast.helper';
	import type { UpsertReign } from '../interfaces/reigns.interfaces';

	export let isUpdate: boolean = false;
	export let reign: UpsertReign = {} as UpsertReign;
	export let ppvs: string[] = [];

	const recalculateDays = () => {
		if (!browser) return;
		const inputWon = document.querySelector('input[name="won_date"]') as HTMLInputElement;
		const inputLost = document.querySelector('input[name="lost_date"]') as HTMLInputElement;
		const wonDate = new Date(inputWon.value);
		const lostDate = inputLost.value ? new Date(inputLost.value) : new Date();
		wonDate.setHours(0, 0, 0, 0);
		lostDate.setHours(0, 0, 0, 0);

		if (wonDate > lostDate) {
			Toast.error('La fecha de victoria no puede ser mayor a la de derrota');
			return false;
		}

		const diffTime = Math.abs(lostDate.getTime() - wonDate.getTime());
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		reign.days = diffDays;
	};
</script>

<div class="common-reign-data-container grid-span-column" id="common-reign-data">
	<Box icon="info-circle" title="Datos comunes">
		<div class="w1 flex start gap-small responsive">
			<Input
				label="Fecha victoria"
				type="date"
				placeholder="dd/mm/aaaa"
				name="won_date"
				value={isUpdate ? reign.won_date?.toISOString().split('T')[0] : ''}
				oninput={recalculateDays}
			/>
			<div class="w1 flex astart start column gap-0">
				<Input
					label="Fecha derrota"
					type="date"
					placeholder="Fecha de fin"
					name="lost_date"
					value={isUpdate ? reign.lost_date?.toISOString().split('T')[0] : ''}
					oninput={recalculateDays}
				/>
				<small>Dejar vacío si el reinado es actual</small>
			</div>
			<Input
				label="Dias"
				name="days"
				type="number"
				placeholder="Días de reinado"
				bind:value={reign.days}
			/>
		</div>

		<div class="w1 flex start gap-small responsive">
			<Input
				label="Show o PPV"
				name="show_won"
				type="text"
				placeholder="Evento en el que se ganó"
				bind:value={reign.ppv_won as string}
				options={['RAW', 'Smackdown', 'AWL', 'Saturday Night Main Event', ...ppvs]}
			/>
			<Input
				label="Forma de victoria"
				name="victory_way"
				type="text"
				placeholder="Forma de victoria"
				bind:value={reign.victory_way as string}
				options={['Pinfall', 'Submission', 'Countout', 'Disqualification', 'Cash-in', 'Otro']}
			/>
		</div>
	</Box>
</div>

<style>
	.grid-span-column {
		grid-column: span 2;
	}

	@media screen and (max-width: 768px) {
		.grid-span-column {
			grid-column: span 1;
		}
	}
</style>
