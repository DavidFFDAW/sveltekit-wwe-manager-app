<script lang="ts">
	import AsyncForm from '$lib/components/forms/async-form.svelte';
	import PageWrapper from '$lib/components/page-wrapper/page-wrapper.svelte';
	import type { Cronjobs } from '@prisma/client';
	import UpsertCronjob from '../upsert-cronjob.svelte';

	export let data: { cronjob: Cronjobs };
</script>

<PageWrapper page="admin-cronjobs-upsert-update">
	<h1 class="admin-cronjobs-title">Actualizar cronjob</h1>
	<AsyncForm
		updateId={data.cronjob.id}
		method="post"
		buttonText="Actualizar cronjob"
		redirect="/admin/cronjobs"
	>
		<UpsertCronjob cronjob={data.cronjob} />
	</AsyncForm>
</PageWrapper>
