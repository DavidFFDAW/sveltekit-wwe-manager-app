<script lang="ts">
	import { Utils } from '$lib/utils/general.utils';

	export let label: string;
	export let name: string;
	export let type: string;
	export let value: string | number = '';
	export let maxLength: number = 255;
	const randomId = Utils.getRandomID(name);
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
</div>
