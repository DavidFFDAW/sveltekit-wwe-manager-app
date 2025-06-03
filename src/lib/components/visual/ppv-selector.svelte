<script lang="ts">
	export let ppvs: string[] = [];
	export let name: string = 'ppv-selector';
	export let selectedId: number | undefined = undefined;
</script>

<div class="ppv-selector-container">
	<h4 class="title">PPV ganado</h4>
	<div class="ppv-selector-list">
		{#each ppvs as ppv}
			<label for={`${name}-${ppv}`} class="label relative">
				<input type="radio" {name} id={`${name}-${ppv}`} bind:group={selectedId} value={ppv} />
				<div class="image-container">
					<span class="name">{ppv}</span>
				</div>
			</label>
		{/each}
	</div>
</div>

<style>
	.ppv-selector-container {
		background-color: #fff;
		padding: 10px;
		border-radius: 10px;
	}

	.ppv-selector-container .ppv-selector-list {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
		gap: 5px;
	}

	.ppv-selector-container .ppv-selector-list label {
		cursor: pointer;
	}

	.ppv-selector-container .ppv-selector-list label input[type='radio'] {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		opacity: 0;
		cursor: pointer;
	}

	.ppv-selector-container .ppv-selector-list label .image-container {
		width: 100%;
		height: 100%;
		padding: 5px;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 5px;
		justify-content: center;
		background-color: #f5f5f5;
		color: #000;
		overflow: hidden;
		filter: grayscale(100%);
	}

	.ppv-selector-container .ppv-selector-list label .image-container img {
		width: 100%;
		height: auto;
		max-height: 80px;
		object-fit: cover;
		overflow: hidden;
	}

	.ppv-selector-container .ppv-selector-list label .image-container span {
		text-align: center;
	}

	.ppv-selector-container .ppv-selector-list label input[type='radio']:checked + .image-container {
		border: 2px solid var(--blue);
		filter: grayscale(0%);
	}
</style>
