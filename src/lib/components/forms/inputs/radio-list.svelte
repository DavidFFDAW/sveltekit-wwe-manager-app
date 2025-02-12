<script lang="ts">
	export let options: { label: string; value: string }[] = [];
	export let label: string;
	export let name: string;
	export let value: string = options[0].value;
	export let itemWidth: number = 200;
</script>

<div class="form-item radio-checkbox-container-wrapper">
	<p class="label form-label">{label}</p>
	<div class="radio-checkbox-container-list grid gap-small" style="--itemWidth: {itemWidth}px;">
		{#each options as optionItem}
			<label class="relative form-label label">
				<input
					type="radio"
					class="radio-checkbox-input"
					{name}
					value={optionItem.value}
					bind:group={value}
					checked={value === optionItem.value}
				/>
				<div class="radio-checkbox-inner-item label-item-{optionItem.value}">
					<span class="label-item-text">
						{optionItem.label}
					</span>
				</div>
			</label>
		{/each}
	</div>
</div>

<style>
	.radio-checkbox-container-wrapper .radio-checkbox-container-list {
		grid-template-columns: repeat(auto-fill, minmax(var(--itemWidth), 1fr));
	}
	.label-item-text {
		color: #000;
	}
	.radio-checkbox-container-wrapper label.form-label {
		display: block;
		font-family: 'Poppins', sans-serif;
		text-align: center;
	}

	.radio-checkbox-container-wrapper .radio-checkbox-input {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		opacity: 0;
		z-index: 5;
		cursor: pointer;
	}

	.radio-checkbox-container-wrapper .radio-checkbox-inner-item {
		position: relative;
		padding: 4px 8px;
		background-color: transparent;
		border: 1px solid #ccc;
		border-radius: 25px;
		overflow: hidden;
		cursor: pointer;
	}

	.radio-checkbox-container-wrapper
		.radio-checkbox-input:checked
		+ .radio-checkbox-inner-item
		.label-item-text {
		color: #fff;
	}
	.radio-checkbox-container-wrapper .radio-checkbox-input:checked + .radio-checkbox-inner-item {
		background-color: var(--imgur);
		border: none;
		color: #fff;
	}

	@media only screen and (max-width: 768px) {
		.radio-checkbox-container-wrapper .radio-checkbox-container-list {
			grid-template-columns: repeat(2, 1fr);
		}
	}
</style>
