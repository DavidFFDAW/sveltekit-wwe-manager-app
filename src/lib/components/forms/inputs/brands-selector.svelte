<script lang="ts">
	import { brands, type Brands } from '$lib/constants/app';
	import { Utils } from '$lib/utils/general.utils';
	const allBrands = Object.values(brands);
	export let value: string | null = allBrands[0].name as Brands;
	$: value = value ? value.toLowerCase() : '';
	const randomId = Utils.getRandomID('brands-selector');
</script>

<div class="form-item brands-selector">
	<label class="label form-label" for="brands-selector-{randomId}">Marca</label>
	<div class="w1 grid three-column-grid gap-small brand-select-grid responsive">
		{#each allBrands as brand}
			<div class="flex center acenter relative brand-select-item branded-{brand.name}">
				<input
					type="radio"
					name="brand"
					value={brand.name}
					id="{randomId}-{brand.name}"
					checked={value === brand.name}
					bind:group={value}
				/>
				<div class="flex center acenter inner">
					<img src={brand.image} class="total-image custom-image-brand-select" alt="" />
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	.grid.three-column-grid {
		grid-template-columns: repeat(3, 1fr);
	}

	.brand-select-item input[type='radio'] {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		opacity: 0;
		z-index: 5;
		cursor: pointer;
	}
	.brand-select-item input[type='radio'] + .inner {
		width: 100%;
		height: 125px;
		position: relative;
		background-color: #fff;
		border: 1px solid #ccc;
		border-radius: 5px;
		overflow: hidden;
		filter: grayscale(100%);
		cursor: pointer;
	}
	.brand-select-item input[type='radio'] + .inner img {
		width: 40%;
		height: auto;
	}
	.brand-select-item input[type='radio']:checked + .inner {
		filter: grayscale(0%);
	}
	.brand-select-item input[type='radio']:checked + .inner img {
		width: 90%;
		height: auto;
	}
	.brand-select-item.branded-raw input[type='radio']:checked + .inner {
		border: 2px solid #f44336;
		padding: 15px;
	}
	.brand-select-item.branded-smackdown input[type='radio']:checked + .inner {
		border: 2px solid #00a2ff;
		padding: 15px;
	}
	.brand-select-item.branded-awl input[type='radio']:checked + .inner {
		border: 2px solid #a43fb8;
		padding: 15px;
	}
</style>
