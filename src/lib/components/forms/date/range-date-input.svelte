<script lang="ts">
	import { onMount } from 'svelte';
	import { Utils } from '$lib/utils/general.utils';
	import type { Instance } from 'flatpickr/dist/types/instance';
	import flatpickr from 'flatpickr';
	import { Spanish } from 'flatpickr/dist/l10n/es.js';
	import 'flatpickr/dist/flatpickr.min.css';

	export let label;
	export let name;
	export let min: string = '';
	export let max: string = '';
	export let startDate: string = '';
	export let endDate: string = '';
	export let classes: string = '';
	export let required: boolean = false;
	const dateFormat = 'Y-m-d'; // Define the date format to be used

	let flatpickrInput: HTMLInputElement;
	let FlatPickr: Instance;
	const uniqueId = Utils.getRandomID(`flatpickr-${name}`);

	onMount(async () => {
		FlatPickr = flatpickr(flatpickrInput, {
			inline: true,
			mode: 'range',
			dateFormat: dateFormat, // Use the defined date format
			allowInput: true,
			minDate: min,
			maxDate: max,
			defaultDate: [startDate, endDate],
			disableMobile: true,
			showMonths: 2,
			locale: Spanish,
			onChange: (selectedDates) => {
				if (selectedDates.length === 2) {
					startDate = Utils.formatFlatpickrDate(selectedDates[0]); // Format date to YYYY-MM-DD
					endDate = Utils.formatFlatpickrDate(selectedDates[1]); // Format date to YYYY-MM-DD
				} else if (selectedDates.length === 1) {
					const date = selectedDates[0];
					startDate = Utils.formatFlatpickrDate(date); // Format date to YYYY-MM-DD
					endDate = ''; // Reset end date if only one date is selected
				} else {
					startDate = ''; // Reset start date if no dates are selected
					endDate = ''; // Reset end date if no dates are selected
				}
			}
		});

		() => {
			if (FlatPickr) FlatPickr.destroy(); // Cleanup on component destroy
		};
	});
</script>

<div class="w1 custom-flatpicker-container form-item {classes} {uniqueId}">
	<label class="label form-label" for={name}>
		{Utils.deAccentize(label)}
		{#if required}
			<span class="required-label">*</span>
		{/if}
	</label>
	<span>{startDate} - {endDate}</span>
	<div class="w1 flatpickerDate">
		<input type="hidden" id={name} {name} bind:this={flatpickrInput} readonly={true} {required} />
	</div>
	<div class="w1 selectedDates">
		{#if startDate && endDate}
			<input type="hidden" name={`${name}-range-start-date`} value={startDate} />
			<input type="hidden" name={`${name}-range-end-date`} value={endDate} />
		{/if}
	</div>
</div>
