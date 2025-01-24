<script lang="ts">
	export let label: string;
	export let name: string;
	export let type: string;
	export let value: string = '';
	export let maxLength: number = 255;
	const randomId = Math.random().toString(36).substring(7);
</script>

<div class="form-item">
	<label
		class="label form-label {$$props.required ? 'required-label' : ''}"
		for={`${name}-${randomId}`}
	>
		{label}
		{#if $$props.required}
			<span class="required-label">*</span>
		{/if}
	</label>
	<input {type} {name} bind:value id={`${name}-${randomId}`} maxlength={maxLength} {...$$props} />
</div>
