<script lang="ts">
	import AsyncForm from '$lib/components/forms/async-form.svelte';
	import PageWrapper from '$lib/components/page-wrapper/page-wrapper.svelte';
	import UpsertTeam from '../upsert-team.svelte';

	export let data;
</script>

<PageWrapper page="blog-update-blog-post">
	<AsyncForm method="post" redirect="/admin/teams" buttonText="Crear equipo">
		<UpsertTeam />
	</AsyncForm>
</PageWrapper>
