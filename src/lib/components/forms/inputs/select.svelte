<script lang="ts">
	import { Utils } from '$lib/utils/general.utils';
	let { label, name, value = $bindable(), required = false, children } = $props();
</script>

<div class="form-item">
	<label class="label flex column gap-5 form-label {required ? 'required-label' : ''}">
		<span class="form-label label">
			{Utils.deAccentize(label)}
			{#if required}
				<span class="required-label">*</span>
			{/if}
		</span>

		<select {name} bind:value {required}>
			{@render children()}
		</select>
	</label>
</div>

<style>
	.form-item label.label {
		font-weight: 500;
		font-size: 14px;
		align-items: flex-start;
	}
	select {
		font-family: 'sourcesans', sans-serif;
		font-size: 14px;
		background-color: #fff;
		border: 1px solid #ddd;
		padding: 10px 6px;
		border-radius: 4px;
	}
</style>
