<script lang="ts">
	import { enhance } from '$app/forms';
	import { errorimage } from '$lib/actions/error.image.js';
	import Debug from '$lib/components/visual/debug.svelte';

	let { data } = $props();
	$inspect(data.cashin);
</script>

<!-- <Debug datas={data.cashin} /> -->

<div class="page page-container">
	<header class="page-header">
		<h1>Canjeo MITB</h1>
		<small>{data.cashin.mitb.championship.name}</small>
	</header>

	<div class="page-content">
		<div class="flex gap-medium">
			<div class="box"></div>
			<div class="box"></div>
		</div>
	</div>

	<form action="" method="post">
		<div class="chps">
			{#each data.cashin.availableChampionships as c}
				<button type="submit" value={c.championship.id} name="championship" class="btn cta down">
					<img
						width="100"
						src={c.championship.image}
						alt={c.championship.name}
						use:errorimage={data.statics.championship}
					/>
				</button>
			{/each}
		</div>
	</form>

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

	.page-content .flex .box:nth-child(1) {
		width: 30%;
	}
	.page-content .flex .box:nth-child(2) {
		width: 70%;
	}
</style>
