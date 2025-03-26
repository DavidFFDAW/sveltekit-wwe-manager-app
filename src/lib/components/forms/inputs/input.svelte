<script lang="ts">
	import { Utils } from '$lib/utils/general.utils';

	type Callback = (value: string | number) => void;
	export let label: string;
	export let name: string;
	export let type: string = 'text';
	export let value: string | number | undefined | null = '';
	export let maxLength: number = 255;
	export let options: string[] = [];
	export let oninput: Callback | undefined = undefined;
	const randomId = Utils.getRandomID(name);

	$: if (oninput && value) oninput(value);
	$: valueLength = value ? value.toString().length : 0;

	let pattern = type === 'number' ? `[0-9]{0,${maxLength}}` : `.{0,${maxLength}}`;
</script>

<div class="form-item">
	<label
		class="label flex between form-label {$$restProps.required ? 'required-label' : ''}"
		for={`${name}-${randomId}`}
	>
		<span>
			{label}
			{#if $$restProps.required}
				<span class="required-label">*</span>
			{/if}
		</span>

		<small class="sourcesans">{valueLength || 0} / {maxLength}</small>
	</label>
	{#if options.length > 0}
		<datalist id={`$${name}-options`}>
			{#each options as option}
				<option value={option}>{option}</option>
			{/each}
		</datalist>
	{/if}

	<input
		{type}
		{name}
		bind:value
		id={`${name}-${randomId}`}
		maxlength={maxLength}
		{pattern}
		{...$$restProps}
		list="${options.length > 0 ? `${name}-options` : ''}"
	/>
	{#if valueLength > maxLength}
		<p class="error-message">
			Este valor es demasiado largo. Intenta reducirlo a un máximo de {maxLength} caracteres.
		</p>
	{/if}
</div>
