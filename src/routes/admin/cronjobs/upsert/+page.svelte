<script lang="ts">
	import AsyncForm from '$lib/components/forms/async-form.svelte';
	import PageWrapper from '$lib/components/page-wrapper/page-wrapper.svelte';
	import UpsertCronjob from './upsert-cronjob.svelte';
</script>

<PageWrapper page="admin-cronjobs-upsert">
	<h1 class="admin-cronjobs-title">Crear cronjob</h1>
	<AsyncForm method="post" buttonText="Guardar cronjob" redirect="/admin/cronjobs">
		<UpsertCronjob />
	</AsyncForm>
</PageWrapper>
