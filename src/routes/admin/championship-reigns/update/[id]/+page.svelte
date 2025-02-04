<script lang="ts">
	import AsyncForm from '$lib/components/forms/async-form.svelte';
	import PageWrapper from '$lib/components/page-wrapper/page-wrapper.svelte';
	import type { Championship, ChampionshipReign, Wrestler } from '@prisma/client';
	import UpsertReigns from '../../components/upsert-reigns.svelte';

	export let data = {
		reign: {} as any,
		wrestlers: [],
		championships: [],
		ppvs: [],
		teams: []
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
		</AsyncForm>
	{/if}
</PageWrapper>
