<script lang="ts">
	import AsyncForm from '$lib/components/forms/async-form.svelte';
	import PageWrapper from '$lib/components/page-wrapper/page-wrapper.svelte';
	import UpsertChampionship from '../upsert-championship.svelte';
	import type { Championship } from '@prisma/client';
</script>

<PageWrapper page="admin-championship-update-page">
	<AsyncForm buttonText={'Crear campeonato'} redirect="/admin/championships">
		<UpsertChampionship championshipDatas={{} as Championship} />
	</AsyncForm>
</PageWrapper>
