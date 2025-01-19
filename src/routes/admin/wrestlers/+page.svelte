<script lang="ts">
	import ButtonCreate from '$lib/components/buttons/button-create.svelte';

	export let data = { wrestlers: [] };
</script>

<div class="admin-page-wrapper admin-wrestlers">
	<h1>Wrestlers</h1>
	<nav class="admin-wrestlers-page-navigation">
		<ul class="admin-wrestlers-list" role="list">
			<li>
				<a href="/admin/wrestlers">Luchadores</a>
				<a href="/admin/ppvs">PPVs</a>
			</li>
		</ul>
	</nav>
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
	.admin-wrestlers-page-navigation {
		display: flex;
		justify-content: space-between;
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
