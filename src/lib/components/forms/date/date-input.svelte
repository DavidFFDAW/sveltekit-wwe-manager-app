<script lang="ts">
	import { onMount } from 'svelte';
	import flatpickr from 'flatpickr';
	import 'flatpickr/dist/flatpickr.min.css';
	import { Utils } from '$lib/utils/general.utils';
	import type { Instance } from 'flatpickr/dist/types/instance';
	import { Spanish } from 'flatpickr/dist/l10n/es';

	let {
		label,
		name,
		min = undefined,
		max = undefined,
		value = null,
		required = false,
		hasTime = false
	} = $props();
	let flatpickrInput: HTMLInputElement | null = null;
	let FlatPickr: Instance;

	const today = new Date();
	let time = $state(Utils.getDateLocaleHourIso(today));

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
				value = FlatPickr.formatDate(date, 'Y-m-d');
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

	// update when date value changes externally
	$effect(() => {
		if (FlatPickr && value) {
			const date = new Date(value);
			if (!isNaN(date.getTime())) {
				FlatPickr.setDate(date, false);
			}
		}
	});
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

	{#if hasTime}
		<label class="label form-label">
			<span class="label-text">Hora</span>
			<input class="time-input" type="time" name="{name}_time" bind:value={time} />
		</label>
	{/if}
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
