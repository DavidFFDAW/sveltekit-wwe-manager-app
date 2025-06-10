<script lang="ts">
	import { page } from '$app/state';
	import Box from '$lib/components/box/box.svelte';
	import WrestlersSelector from '$lib/components/forms/selector/specific/wrestlers-selector.svelte';
	// import AdminHeader from '$lib/components/headers/admin-header.svelte';
	import PageWrapper from '$lib/components/page-wrapper/page-wrapper.svelte';
	import Image from '$lib/components/visual/image.svelte';
	import type { Wrestler } from '@prisma/client';
	import { fade } from 'svelte/transition';
	import { ChoosingAlgorithm } from './draft.algorithm.js';
	import DraftPickPreview from './draft-pick-preview.svelte';
	import AsyncForm from '$lib/components/forms/async-form.svelte';

	const searchParams = page.url.searchParams;
	let brand: string = searchParams.has('brand')
		? (searchParams.get('brand') as string)
		: 'smackdown';

	export let data;
	let innerList: Wrestler[] = data.wrestlers;
	let showPreview: boolean = false;
	let choosePreview: { raw: Wrestler; smackdown: Wrestler };
	let brandsRoster: { raw: Wrestler[]; smackdown: Wrestler[] } = { raw: [], smackdown: [] };
	let bindableSelected: number | undefined = undefined;
	$: selectedWrestler = data.wrestlers.find((wrestler) => wrestler.id === bindableSelected);

	const updateBrandRoster = (wrestler: Wrestler, brand: string = 'smackdown') => {
		const currentBrand = brand as keyof typeof brandsRoster;
		const roster = brandsRoster[currentBrand];
		brandsRoster[currentBrand] = [...roster, wrestler];
	};

	const updateChoosingPreview = (raw: Wrestler | null, smackdown: Wrestler | null) => {
		if (!raw || !smackdown) {
			showPreview = false;
			return;
		}
		choosePreview = {
			raw: raw,
			smackdown: smackdown
		};
		showPreview = true;
	};

	const signupWrestler = async (event: Event) => {
		event.preventDefault();
		const currentBrand = brand as keyof typeof brandsRoster;
		innerList = innerList.filter((wrestler) => wrestler.id !== bindableSelected);
		updateBrandRoster(selectedWrestler as Wrestler);

		const opposingBrandChoosing = ChoosingAlgorithm.getOpposingBrandSelectedWrestler(
			selectedWrestler as Wrestler,
			innerList
		);
		if (!opposingBrandChoosing) {
			console.error('No opposing brand wrestler found');
			return;
		}
		const opposingBrand = Object.keys(brandsRoster).find(
			(key) => key !== currentBrand
		) as keyof typeof brandsRoster;
		brandsRoster[opposingBrand] = [...brandsRoster[opposingBrand], opposingBrandChoosing];
		innerList = innerList.filter((wrestler) => wrestler.id !== opposingBrandChoosing?.id);

		updateChoosingPreview(
			brandsRoster.raw[brandsRoster.raw.length - 1],
			brandsRoster.smackdown[brandsRoster.smackdown.length - 1]
		);

		bindableSelected = undefined;
		selectedWrestler = undefined;
	};
</script>

<PageWrapper page="admin-draft-page">
	<!-- <AdminHeader /> -->
	<h1>Draft</h1>

	{#if showPreview && choosePreview.raw && choosePreview.smackdown}
		<DraftPickPreview
			bind:raw={choosePreview.raw}
			bind:smackdown={choosePreview.smackdown}
			bind:showPreview
		/>
	{/if}

	<Box title="Draft" icon="draft">
		<form action="" class="w1" method="post" on:submit|preventDefault={signupWrestler}>
			<div class="w1 flex total between astart gap-medium responsive-column-reverse">
				{#if selectedWrestler}
					<div class="w1 selected-wrestler-block wrestler-technical-sheet" transition:fade>
						<div class="w1 flex astart gap-small">
							<p class="wrestler-name">{selectedWrestler.name}</p>
							<p class="wrestler-status">{selectedWrestler.status}</p>
						</div>
						<div class="w1 wrestler-image-container">
							<Image
								width={80}
								height={80}
								src={selectedWrestler.image_name as string}
								alt={selectedWrestler.name}
								class="wrestler-image"
							/>
						</div>
						<div class="w1 flex end gap-small down">
							<button type="submit" class="btn btn-dark button-{brand}">Fichar</button>
						</div>
					</div>
				{/if}
				<div class="w1 wrestler-selection-list">
					<WrestlersSelector
						list={innerList}
						name="draft-wrestlers"
						maxHeight={450}
						itemWidth={300}
						bind:selectedItem={bindableSelected}
					/>
				</div>
			</div>
		</form>
	</Box>

	<AsyncForm action="saveDraft" method="post" redirect="/admin/wrestlers">
		<div class="w1 flex between total astart gap-medium responsive">
			<Box title="Raw" icon="raw" classes="w1 box-raw">
				<div class="w1 flex column gap-small">
					{#each brandsRoster.raw as wrestler}
						<input type="hidden" name="draft-wrestlers[raw]" value={wrestler.id} />
						<div class="w1 flex astart gap-small wrestler-item-radio-container">
							<label class="w1 block">
								<div class="w1 resource-item-radio-inner h1">
									<Image
										class="h1"
										data-image-src={wrestler.image_name as string}
										src={wrestler.image_name as string}
										alt={wrestler.name}
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
						<input type="hidden" name="draft-wrestlers[smackdown]" value={wrestler.id} />
						<div class="w1 flex astart gap-small wrestler-item-radio-container">
							<label class="w1 block">
								<div class="w1 resource-item-radio-inner h1">
									<Image
										class="h1"
										data-image-src={wrestler.image_name as string}
										src={wrestler.image_name as string}
										alt={wrestler.name}
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

				<div class="w1 flex {innerList.length <= 5 ? 'between' : 'end'} astart gap-small">
					{#if innerList.length <= 5}
						<button type="submit" class="btn btn-dark button-{brand}">
							Finalizar Draft y guardar cambios
						</button>
					{/if}

					<button type="button" class="btn btn-dark button-{brand}" on:click={signupWrestler}>
						Fichar
					</button>
				</div>
			</Box>
		</div>
	</AsyncForm>
</PageWrapper>
