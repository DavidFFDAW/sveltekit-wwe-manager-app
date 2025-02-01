<script lang="ts">
	import { Utils } from '$lib/utils/general.utils';

	type Callback = (value: string | number) => void;
	export let label: string;
	export let name: string;
	export let type: string;
	export let value: string | number = '';
	export let maxLength: number = 255;
	export let oninput: Callback | undefined = undefined;
	const randomId = Utils.getRandomID(name);

	$: if (oninput) oninput(value);
</script>

<div class="form-item">
	<label
		class="label form-label {$$restProps.required ? 'required-label' : ''}"
		for={`${name}-${randomId}`}
	>
		{label}
		{#if $$restProps.required}
			<span class="required-label">*</span>
		{/if}
	</label>
	<input
		{type}
		{name}
		bind:value
		id={`${name}-${randomId}`}
		maxlength={maxLength}
		{...$$restProps}
	/>
	{#if value.toString().length > maxLength}
		<p class="error-message">
			Este valor es demasiado largo. Intenta reducirlo a un máximo de {maxLength} caracteres.
		</p>
	{/if}
</div>
