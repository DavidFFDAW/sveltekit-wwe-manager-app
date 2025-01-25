<script>
	import AsyncForm from '$lib/components/forms/async-form.svelte';
	import PageWrapper from '$lib/components/page-wrapper/page-wrapper.svelte';
	import WrestlerUpsert from '../wrestler-upsert.svelte';
</script>

<PageWrapper page="wrestler-create">
	<AsyncForm redirect="/admin/wrestlers" method="post" buttonText="Crear luchador">
		<WrestlerUpsert />
	</AsyncForm>
</PageWrapper>
