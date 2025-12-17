<script lang="ts">
	import PageWrapper from '$lib/components/page-wrapper/page-wrapper.svelte';
	import type { BlogPost } from '@prisma/client';
	import BlogUpsert from '../../blog-upsert.svelte';

	let { data } = $props<{ post: BlogPost }>();
</script>

<PageWrapper page="blog-update-blog-post">
	<BlogUpsert post={data.post} />
</PageWrapper>
