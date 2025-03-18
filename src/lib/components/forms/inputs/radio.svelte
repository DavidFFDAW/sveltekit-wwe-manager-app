<script lang="ts">
	export let type: string = 'radio';
	export let label: string;
	export let name: string;
	export let value: string;
	export let group: string = '';
	export let checked: boolean = false;
</script>

<div class="radio-checkbox-container-wrapper">
	<label class="relative form-label label">
		{#if type === 'checkbox' || type === 'check'}
			<input
				type="checkbox"
				class="radio-checkbox-input"
				{name}
				{value}
				{...$$restProps}
				checked={group ? group === value : checked}
			/>
		{:else}
			<input
				type="radio"
				class="radio-checkbox-input"
				{name}
				{value}
				bind:group
				checked={group ? group === value : checked}
				{...$$restProps}
			/>
		{/if}
		<div class="radio-checkbox-inner-item label-item-{value}">
			<span class="label-item-text">
				{label}
			</span>
		</div>
	</label>
</div>
