<script lang="ts">
	import AsyncForm from '$lib/components/forms/async-form.svelte';
	import PageWrapper from '$lib/components/page-wrapper/page-wrapper.svelte';
	import type { BlogPost } from '@prisma/client';
	import BlogUpsert from '../../blog-upsert.svelte';
	export let data: { post: BlogPost };
</script>

<PageWrapper page="blog-update-blog-post">
	<AsyncForm redirect="/admin/blog" method="put" buttonText="Guardar cambios">
		<BlogUpsert bind:post={data.post} />
	</AsyncForm>
</PageWrapper>
