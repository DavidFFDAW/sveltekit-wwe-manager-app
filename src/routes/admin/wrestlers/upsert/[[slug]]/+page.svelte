<script lang="ts">
	import AsyncForm from '$lib/components/forms/async-form.svelte';
	import PageWrapper from '$lib/components/page-wrapper/page-wrapper.svelte';
	import WrestlerUpsert from '../../wrestler-upsert.svelte';
	export let data;
</script>

<PageWrapper page="wrestler-update">
	<AsyncForm
		redirect="/admin/wrestlers"
		method="post"
		action="upsert"
		buttonText={data.isUpdate ? `Editar ${data.wrestler.name}` : 'Crear luchador'}
		updateId={Number(data.wrestler.id)}
	>
		<WrestlerUpsert wrestler={data.wrestler} />
	</AsyncForm>
</PageWrapper>
