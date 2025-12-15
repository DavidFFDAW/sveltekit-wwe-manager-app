<script lang="ts">
	import AsyncForm from '$lib/components/forms/async-form.svelte';
	import PageWrapper from '$lib/components/page-wrapper/page-wrapper.svelte';
	import type { BlogPost } from '@prisma/client';
	import BlogUpsert from '../../blog-upsert.svelte';
	import Dialog from '$lib/components/dialog/dialog.svelte';
	import BlogIaForm from '../../blog-ia-form.svelte';

	let iaPopupOpened = $state(false);
	let { data } = $props<{ post: BlogPost }>();

	// onMount(() => {
	// 	console.log('Editing post:', data.post);
	// 	setTimeout(() => {
	// 		data.post.content = 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';
	// 		console.log('BBBBBBBBBBBBBBBBBBB');
	// 	}, 2000);
	// });
</script>

<PageWrapper page="blog-update-blog-post">
	<AsyncForm
		redirect="/admin/blog"
		method="put"
		buttonText="Guardar cambios"
		updateId={data.post.id}
	>
		<BlogUpsert post={data.post} bind:iaPopupOpened />
	</AsyncForm>

	<Dialog
		bind:opened={iaPopupOpened}
		class="ia-text-generate-dialog auto-adjust-height"
		title="Generar contenido del post con IA"
	>
		<BlogIaForm bind:content={data.post.content} />
	</Dialog>
</PageWrapper>

<style>
	:global(.ia-text-generate-dialog) {
		padding: 0;
		max-width: 600px;
		max-height: 80vh;
	}
</style>
