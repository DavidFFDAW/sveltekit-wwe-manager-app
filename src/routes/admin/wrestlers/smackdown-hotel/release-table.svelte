<script lang="ts">
	import { fade } from 'svelte/transition';
	import { errorimage } from '$lib/actions/error.image';
	import Icon from '$lib/components/icons/icon.svelte';

	type Wrestler = { id: number; name: string; image_name: string | null };
	export let wrestlers: Wrestler[] = [];

	const removeWrestler = (wrestler: Wrestler) => (event: Event) => {
		event.preventDefault();
		wrestlers = wrestlers.filter((w) => w !== wrestler);
	};
</script>

<div class="grid">
	{#each wrestlers as wrestler}
		<div class="w1 card relative" transition:fade>
			<img
				use:errorimage={'/vacant.webp'}
				src={wrestler.image_name}
				class="card-img-top"
				alt={wrestler.name}
			/>
			<div class="card-body">
				<h5 class="card-title tcenter">{wrestler.name}</h5>
				<button
					type="button"
					class="absolute top right btn btn-danger"
					on:click={removeWrestler(wrestler)}
				>
					<Icon icon="trash" />
				</button>
			</div>
		</div>

		<input type="hidden" name="releases[]" value={wrestler.id} />
	{/each}
</div>

<style>
	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
		gap: 1rem;
	}

	.card {
		box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
		border-radius: 5px;
		overflow: hidden;
	}

	.card h5 {
		margin: 0;
		font-size: 1rem;
		padding: 15px 5px;
	}

	.card .btn.btn-danger {
		padding: 5px;
		border-radius: 0;
	}
</style>
