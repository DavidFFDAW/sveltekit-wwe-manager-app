<script lang="ts">
	import ButtonCreate from '$lib/components/buttons/button-create.svelte';
	export let data = { wrestlers: [], search: '' };
</script>

<div class="admin-page-wrapper admin-wrestlers padding">
	<form action="/admin/wrestlers" method="get">
		<div class="flex search-wrapper">
			<input type="search" name="search" placeholder="Search..." bind:value={data.search} />
			<button type="submit">Search</button>
		</div>
	</form>

	<h1 class="uppercase">Wrestlers</h1>

	<div class="admin-wrestlers-list">
		{#if data.wrestlers.length > 0}
			{#each data.wrestlers as wrestler}
				<div class="admin-wrestler-card">
					<div class="admin-wrestler-card-image">
						<img src={wrestler.image_name} alt={wrestler.name} />
					</div>
					<div class="admin-wrestler-card-info">
						<h2>{wrestler.name}</h2>
						<p>{wrestler.status}</p>
					</div>
				</div>
			{/each}
		{:else}
			<p>No wrestlers found</p>
		{/if}
	</div>

	<ButtonCreate endpoint="wrestlers/create" />
</div>

<style>
	.search-wrapper {
		margin-bottom: 1rem;
	}

	.search-wrapper input {
		padding: 0.5rem;
		border: 1px solid #ccc;
		border-radius: 5px;
		width: 100%;
	}

	.search-wrapper button {
		padding: 0.5rem 1rem;
		border: 1px solid #ccc;
		border-radius: 5px;
		background-color: #f9f9f9;
		margin-left: 1rem;
		cursor: pointer;
	}

	.admin-wrestlers-list {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: 1rem;
	}

	.admin-wrestler-card {
		display: flex;
		flex-direction: column;
		background-color: #f9f9f9;
		border-radius: 5px;
		overflow: hidden;
	}

	.admin-wrestler-card-image {
		width: 100%;
		height: 200px;
		overflow: hidden;
	}

	.admin-wrestler-card-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.admin-wrestler-card-info {
		padding: 1rem;
	}

	.admin-wrestler-card-info h2 {
		margin: 0;
	}

	.admin-wrestler-card-info p {
		margin: 0;
	}
</style>
