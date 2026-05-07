<script lang="ts">
	import { errorimage } from '$lib/actions/error.image.js';

	let { data } = $props();
	$inspect(data.cashin);
</script>

<div class="page page-container">
	<header class="page-header">
		<h1>Canjeo MITB</h1>
		<small>{data.cashin.mitb.championship.name}</small>
	</header>

	<div class="casher">
		<div class="casher-info" style="background-image: url({data.cashin.mitb.championship.image})">
			<img
				width="100"
				src={data.cashin.mitb.wrestler.image_name as string}
				alt={data.cashin.mitb.wrestler.name}
				use:errorimage={data.statics.vacant}
			/>
			<div class="casher-text">
				<div class="casher-name">{data.cashin.mitb.wrestler.name}</div>
				<div class="casher-date">{data.cashin.mitb.date}</div>
			</div>
		</div>
	</div>

	<div class="championships-list">
		{#each data.cashin.availableChampionships as championship}
			<div class="championship">
				<img
					width="100"
					src={championship.image}
					alt={championship.name}
					use:errorimage={data.statics.championship}
				/>
				<div>{championship.name}</div>
			</div>
		{/each}
	</div>
</div>

<style>
	.page.page-container {
		max-width: 800px;
		margin: 0 auto;
	}
	.casher {
		display: flex;
		justify-content: center;
		margin: 10px 0;
	}
	.casher .casher-info {
		width: 100%;
		max-width: 200px;
		height: 200px;
		padding: 2rem;
		position: relative;
		background-color: #fff;
		border: 1px solid #ccc;
		border-radius: 8px;
		background-size: contain;
		background-position: center;
		background-repeat: no-repeat;
		overflow: hidden;
	}

	.casher img {
		position: absolute;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
		width: auto;
		max-width: 100%;
		height: 80%;
	}
</style>
