<script>
	import AsyncForm from '$lib/components/forms/async-form.svelte';
	import PageWrapper from '$lib/components/page-wrapper/page-wrapper.svelte';
	import BlogUpsert from '../blog-upsert.svelte';
</script>

<PageWrapper page="blog-new-blog-post">
	<AsyncForm redirect="/admin/blog" method="post" buttonText="Crear Post">
		<BlogUpsert />
	</AsyncForm>
</PageWrapper>
