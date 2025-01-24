<script lang="ts">
	import { brands } from '$lib/constants/app';

	const allBrands = Object.values(brands);
	export let value = '';
	export let required = false;
	const randomId = Math.random().toString(36).substring(7);
	console.log(allBrands);
</script>

<div class="form-item brands-selector">
	<label class="label form-label" for="brands-selector-{randomId}">Marca</label>
	<div class="w1 grid three-column-grid gap-small brand-select-grid responsive">
		<div class="flex center acenter relative brand-select-item branded-RAW">
			<input type="radio" name="brand" value="raw" checked={value === 'raw'} />
			<div class="flex center acenter inner">
				<img src="/raw.webp" class="total-image custom-image-brand-select" alt="" />
			</div>
		</div>
		<div class="flex center acenter relative brand-select-item branded-SD">
			<input type="radio" name="brand" value="smackdown" checked={value === 'smackdown'} />
			<div class="flex center acenter inner">
				<img src="/smackdown.webp" class="total-image custom-image-brand-select" alt="" />
			</div>
		</div>
		<div class="flex center acenter relative brand-select-item branded-AWL">
			<input type="radio" name="brand" value="awl" checked={value === 'awl'} />
			<div class="flex center acenter inner">
				<img src="/awl.webp" class="total-image custom-image-brand-select" alt="" />
			</div>
		</div>
	</div>
</div>

<style>
	.grid.three-column-grid {
		grid-template-columns: repeat(3, 1fr);
	}
	.brand-select-item {
		position: relative;
		width: 100%;
		height: 125px;
		background-color: #fff;
		border: 1px solid #ccc;
		border-radius: 5px;
		overflow: hidden;
		cursor: pointer;
		padding: 15px;
	}
	.brand-select-item.selected.branded-RAW:before {
		background: conic-gradient(transparent 270deg, var(--raw), transparent);
	}
	.brand-select-item.selected:before {
		content: '';
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		aspect-ratio: 1;
		width: 100%;
		animation: brandSelectItem 2s linear infinite;
	}
	.brand-select-item.selected:after {
		content: '';
		position: absolute;
		background-color: #fff;
		border-radius: inherit;
		inset: 3;
		width: calc(100% - 6px);
		height: calc(100% - 6px);
		filter: blur(7px);
	}
	.brand-select-item.selected .inner {
		width: 75%;
		height: auto;
		opacity: 1;
		z-index: 1;
	}
</style>
