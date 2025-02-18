<script lang="ts">
	import AsyncForm from '$lib/components/forms/async-form.svelte';
	import PageWrapper from '$lib/components/page-wrapper/page-wrapper.svelte';
	import type { Championship, ChampionshipReign, Wrestler } from '@prisma/client';
	import UpsertReigns from '../../components/upsert-reigns.svelte';
	import UpsertReignNewDesign from '../../components/new-design/upsert-reign.svelte';
	import type {
		UpsertReign,
		UpserReignWrestler,
		UpserReignChampionship,
		UpsertReignTeams
	} from '../../interfaces/reigns.interfaces';

	export let data = {
		reign: {} as any,
		wrestlers: [],
		championships: [],
		ppvs: [],
		teams: [],
		newDesign: false
	};
</script>

<PageWrapper page="admin-championship-reigns-update-page">
	<h1 class="none">Administrar reinados de campeonato</h1>

	{#if data.reign}
		<AsyncForm
			method="post"
			buttonText="Guardar cambios"
			redirect="/admin/championship-reigns"
			updateId={data.reign.id}
		>
			{#if data.newDesign}
				<UpsertReignNewDesign
					reignData={{
						reign: data.reign as UpsertReign,
						wrestlers: data.wrestlers.map((wrestler) => ({
							id: wrestler.id,
							name: wrestler.name,
							image: wrestler.image_name,
							gender: wrestler.sex
						})) as UpserReignWrestler[],
						championships: data.championships as UpserReignChampionship[],
						teams: data.teams
					}}
				/>
			{:else}
				<UpsertReigns
					reign={data.reign as ChampionshipReign & { Wrestler: Wrestler } & {
						Championship: Championship;
					} & {
						Partner: Wrestler;
					}}
					wrestlers={data.wrestlers.map((wrestler) => ({
						id: wrestler.id,
						name: wrestler.name,
						image: wrestler.image_name,
						gender: wrestler.sex
					})) as { id: number; name: string; image: string; gender: string }[]}
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
	{/if}
</PageWrapper>
