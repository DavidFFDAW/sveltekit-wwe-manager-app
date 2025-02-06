<script lang="ts">
	import AsyncForm from '$lib/components/forms/async-form.svelte';
	import PageWrapper from '$lib/components/page-wrapper/page-wrapper.svelte';
	import UpsertReigns from '../components/upsert-reigns.svelte';
	import type { UpserReignWrestler } from '../interfaces/reigns.interfaces';

	export let data = {
		wrestlers: [],
		championships: [],
		ppvs: [],
		teams: []
	};
</script>

<PageWrapper page="admin-championship-reigns-update-page">
	<h1 class="none">Administrar reinados de campeonato</h1>

	<AsyncForm method="post" buttonText="Guardar cambios" redirect="/admin/championship-reigns">
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
	</AsyncForm>
</PageWrapper>
