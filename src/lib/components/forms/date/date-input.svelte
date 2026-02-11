<script lang="ts">
	import { onMount } from 'svelte';
	import flatpickr from 'flatpickr';
	import 'flatpickr/dist/flatpickr.min.css';
	import { Utils } from '$lib/utils/general.utils';
	import type { Instance } from 'flatpickr/dist/types/instance';
	import { Spanish } from 'flatpickr/dist/l10n/es';

	export let label;
	export let name;
	export let min: string = '';
	export let max: string = '';
	export let value: string | null | undefined = null;
	export let required: boolean = false;

	let flatpickrInput: HTMLInputElement | null = null;
	let FlatPickr: Instance;

	onMount(() => {
		if (!flatpickrInput) return;
		FlatPickr = flatpickr(flatpickrInput, {
			dateFormat: 'Y-m-d',
			altInput: true,
			altFormat: 'j F Y',
			allowInput: true,
			minDate: min,
			maxDate: max,
			defaultDate: value || undefined,
			locale: {
				...Spanish,
				firstDayOfWeek: 1 // Start week on Monday
			},
			onChange: ([date]) => {
				value = date.toISOString().split('T')[0]; // Format date to YYYY-MM-DD
			}
		});

		() => {
			if (FlatPickr) FlatPickr.destroy(); // Cleanup on component destroy
		};
	});

	const handleRemoveDate = () => {
		value = null;
		if (FlatPickr) FlatPickr.clear();
	};

	$: if (FlatPickr) {
		const minDatePlusOne = new Date(min);
		minDatePlusOne.setDate(minDatePlusOne.getDate() + 2);
		const maxDate = new Date(max);
		maxDate.setDate(maxDate.getDate() - 1);
		FlatPickr.set('minDate', minDatePlusOne);
		FlatPickr.set('maxDate', maxDate);
	}
</script>

<div class="flatpicker-container form-item">
	<label class="label form-label" for={name}>
		{Utils.deAccentize(label)}
		{#if required}
			<span class="required-label">*</span>
		{/if}
	</label>
	<div class="w1 flex end gap-5">
		<input type="hidden" id={name} {name} bind:this={flatpickrInput} readonly={true} {required} />
		<button
			class="btn icon remove"
			type="button"
			aria-label="Clear date"
			title="Borrar fecha"
			onclick={handleRemoveDate}
		>
			<i class="bi bi-x-lg"></i>
		</button>
	</div>
</div>

<style>
	.btn.remove {
		height: 100%;
		display: flex;
		padding: 5px 6px;
		border: 1px solid #ddd;
		background-color: #fff;
		border-radius: 4px;
	}
</style>
