<script lang="ts">
	import AsyncForm from '$lib/components/forms/async-form.svelte';
	import PageWrapper from '$lib/components/page-wrapper/page-wrapper.svelte';
	import type { Wrestler } from '@prisma/client';
	import WrestlerUpsert from '../../wrestler-upsert.svelte';
	export let data: { wrestler: Wrestler; slug: string };
</script>

<PageWrapper page="wrestler-update">
	<AsyncForm
		redirect="/admin/wrestlers"
		method="post"
		action="update"
		buttonText="Editar {data.wrestler.name}"
		updateId={Number(data.wrestler.id)}
	>
		<WrestlerUpsert wrestler={data.wrestler} />
	</AsyncForm>
</PageWrapper>
