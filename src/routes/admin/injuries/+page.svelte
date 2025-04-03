<script lang="ts">
	import Dialog from '$lib/components/dialog/dialog.svelte';
	import Input from '$lib/components/forms/inputs/input.svelte';
	import WrestlersSelector from '$lib/components/forms/selector/specific/wrestlers-selector.svelte';
	import PageWrapper from '$lib/components/page-wrapper/page-wrapper.svelte';
	import { fade } from 'svelte/transition';

	export let data;
	let showUpsertDialog: boolean = false;
</script>

<PageWrapper page="admin-injuries-page">
	<h1>Injuries</h1>
	<div class="w1 flex total between astart gap-medium responsive">
		<div class="w1 selected-wrestler-block wrestler-technical-sheet" transition:fade>
			<div class="w1 flex astart gap-small">
				<p class="wrestler-name">Wrestler Name</p>
				<p class="wrestler-status">Status</p>
			</div>
			<div class="w1 wrestler-image-container">
				<img src="/noimage.jpg" alt="Wrestler Name" width={80} height={80} class="wrestler-image" />
			</div>
			<div class="w1 flex end gap-small down">
				<button type="button" class="btn btn-dark" on:click={() => (showUpsertDialog = true)}>
					Crear lesión
				</button>
			</div>
		</div>
	</div>

	<Dialog opened={showUpsertDialog}>
		<form method="post" class="w1 flex column gap-medium">
			<WrestlersSelector
				list={data.wrestlers}
				name="injured-wrestler"
				maxHeight={300}
				itemWidth={300}
			/>

			<Input
				type="text"
				name="injury-name"
				label="Nombre de la lesión"
				placeholder="Nombre de la lesión"
				required={true}
			/>

			<div class="w1 flex start acenter">
				<Input
					type="date"
					name="start-date"
					label="Inicio"
					placeholder="2025-01-01"
					required={false}
				/>

				<Input
					type="date"
					name="end-date"
					label="Finalización"
					placeholder="2025-01-01"
					required={true}
				/>
			</div>

			<div class="w1 flex end gap-small down">
				<button type="button" class="btn btn-dark" on:click={() => (showUpsertDialog = false)}>
					Cancelar
				</button>
				<button type="submit" class="btn btn-dark">Crear lesión</button>
			</div>
		</form>
	</Dialog>
</PageWrapper>

<style>
	dialog {
		width: 400px;
		height: 200px;
		border-radius: 8px;
		padding: 20px;
	}

	dialog[open] {
		opacity: 1;
		transition: opacity 0.3s ease-in-out;
	}
</style>
