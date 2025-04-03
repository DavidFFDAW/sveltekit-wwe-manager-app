<script lang="ts">
	import { page } from '$app/state';
	import { errorimage } from '$lib/actions/error.image.js';
	import Box from '$lib/components/box/box.svelte';
	import WrestlersSelector from '$lib/components/forms/selector/specific/wrestlers-selector.svelte';
	// import AdminHeader from '$lib/components/headers/admin-header.svelte';
	import PageWrapper from '$lib/components/page-wrapper/page-wrapper.svelte';
	import type { Wrestler } from '@prisma/client';
	import { fade } from 'svelte/transition';

	const searchParams = page.url.searchParams;
	let brand: string = searchParams.has('brand')
		? (searchParams.get('brand') as string)
		: 'smackdown';

	export let data;
	let brandsRoster: { raw: Wrestler[]; smackdown: Wrestler[] } = { raw: [], smackdown: [] };
	let bindableSelected: number | undefined = undefined;
	$: selectedWrestler = data.wrestlers.find((wrestler) => wrestler.id === bindableSelected);

	const signupWrestler = async (event: Event) => {
		event.preventDefault();
		console.log('Signup wrestler', selectedWrestler);
	};
</script>

<PageWrapper page="admin-draft-page">
	<!-- <AdminHeader /> -->
	<h1>Draft</h1>

	<Box title="Draft" icon="draft">
		<form action="" class="w1" method="post" on:submit|preventDefault={signupWrestler}>
			<div class="w1 flex total between astart gap-medium responsive">
				{#if selectedWrestler}
					<div class="w1 selected-wrestler-block wrestler-technical-sheet" transition:fade>
						<div class="w1 flex astart gap-small">
							<p class="wrestler-name">{selectedWrestler.name}</p>
							<p class="wrestler-status">{selectedWrestler.status}</p>
						</div>
						<div class="w1 wrestler-image-container">
							<img
								width={80}
								height={80}
								src={selectedWrestler.image_name as string}
								alt={selectedWrestler.name}
								class="wrestler-image"
								use:errorimage={'/vacant.webp'}
							/>
						</div>
						<div class="w1 flex end gap-small down">
							<button type="submit" class="btn btn-dark button-{brand}">Fichar</button>
						</div>
					</div>
				{/if}
				<div class="w1 wrestler-selection-list">
					<WrestlersSelector
						list={data.wrestlers}
						name="draft-wrestlers"
						maxHeight={450}
						bind:selectedItem={bindableSelected}
					/>
				</div>
			</div>
		</form>
	</Box>

	<div class="w1 flex between total astart gap-medium responsive">
		<Box title="Raw" icon="raw" classes="w1 box-raw">
			<div class="w1 flex column gap-small">
				{#each brandsRoster.raw as wrestler}
					<div class="w1 flex astart gap-small wrestler-item-radio-container">
						<label class="w1 block">
							<input type="checkbox" name="draft-wrestlers" value={wrestler.id} />
							<div class="resource-item-radio-inner h1">
								<img
									class="h1"
									data-image-src={wrestler.image_name as string}
									src={wrestler.image_name as string}
									alt={wrestler.name}
									use:errorimage={'/vacant.webp'}
								/>
								<div class="realative info-block flex astart column nogap">
									<span>{wrestler.name}</span>
									<small>Estado: {wrestler.status}</small>
									<small>Media: {wrestler.overall}</small>
								</div>
							</div>
						</label>
					</div>
				{/each}
			</div>
		</Box>

		<Box title="Smackdown" icon="smackdown" classes="w1 box-smackdown">
			<div class="w1 flex column gap-small">
				{#each brandsRoster.smackdown as wrestler}
					<div class="w1 flex astart gap-small wrestler-item-radio-container">
						<label class="w1 block">
							<input type="checkbox" name="draft-wrestlers" value={wrestler.id} />
							<div class="resource-item-radio-inner h1">
								<img
									class="h1"
									data-image-src={wrestler.image_name as string}
									src={wrestler.image_name as string}
									alt={wrestler.name}
									use:errorimage={'/vacant.webp'}
								/>
								<div class="realative info-block flex astart column nogap">
									<span>{wrestler.name}</span>
									<small>Estado: {wrestler.status}</small>
									<small>Media: {wrestler.overall}</small>
								</div>
							</div>
						</label>
					</div>
				{/each}
			</div>
		</Box>
	</div>
</PageWrapper>
