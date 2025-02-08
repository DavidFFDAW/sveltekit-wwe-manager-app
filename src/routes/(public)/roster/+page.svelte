<script>
	export let data = { wrestlers: [] };
</script>

<div class="wrestlers-list">
	{#each data.wrestlers as wrestler}
		<div class="single-wrestler">
			<img src={wrestler.image_name} alt={wrestler.name} />
			<h3>{wrestler.name}</h3>
		</div>
	{/each}
</div>

<form action="" method="get">
	<input type="text" name="search" placeholder="Search" />

	<button type="submit">Search</button>
</form>

<style>
	.wrestlers-list {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
		gap: 20px;
	}

	.single-wrestler {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10px;
	}

	.single-wrestler img {
		max-width: 100%;
		height: auto;
		object-fit: cover;
	}
</style>
