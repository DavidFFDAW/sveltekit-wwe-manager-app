<script lang="ts">
	import { Utils } from '$lib/utils/general.utils';
	let { label, name, value = $bindable(), required = false, children } = $props();
</script>

<div class="form-item">
	<label class="label flex between form-label {required ? 'required-label' : ''}">
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
