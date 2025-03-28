<script lang="ts">
	import { page } from '$app/state';
	import AsyncForm from '$lib/components/forms/async-form.svelte';
	import PageWrapper from '$lib/components/page-wrapper/page-wrapper.svelte';
	import Multistep from '../components/multistep.svelte';
	import UpsertReigns from '../components/upsert-reigns.svelte';
	import type { UpserReignWrestler } from '../interfaces/reigns.interfaces';

	export let data = {
		wrestlers: [],
		championships: [],
		ppvs: [],
		teams: []
	};

	$: isNewDesign = page.url.searchParams.has('new');
</script>

<PageWrapper page="admin-championship-reigns-update-page">
	<h1 class="none">Administrar reinados de campeonato</h1>

	<AsyncForm
		method="post"
		buttonText="Guardar cambios"
		redirect="/admin/championship-reigns"
		showButtons={!isNewDesign}
	>
		{#if page.url.searchParams.has('new')}
			<Multistep
				reign={{} as any}
				wrestlers={data.wrestlers.map((wrestler) => ({
					id: wrestler.id,
					name: wrestler.name,
					image: wrestler.image_name,
					gender: wrestler.sex,
					status: wrestler.status
				})) as UpserReignWrestler[]}
				championships={data.championships as {
					id: number;
					name: string;
					image: string;
					gender: string;
					tag: boolean;
				}[]}
				ppvs={data.ppvs}
				teams={data.teams}
			/>
		{:else}
			<UpsertReigns
				reign={{} as any}
				wrestlers={data.wrestlers.map((wrestler) => ({
					id: wrestler.id,
					name: wrestler.name,
					image: wrestler.image_name,
					gender: wrestler.sex,
					status: wrestler.status
				})) as UpserReignWrestler[]}
				championships={data.championships as {
					id: number;
					name: string;
					image: string;
					gender: string;
					tag: boolean;
				}[]}
				ppvs={data.ppvs}
				teams={data.teams}
			/>
		{/if}
	</AsyncForm>
</PageWrapper>
