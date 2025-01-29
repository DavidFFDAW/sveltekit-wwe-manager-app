<script lang="ts">
	import Box from '$lib/components/box/box.svelte';
	import Input from '$lib/components/forms/inputs/input.svelte';
	import QuillInput from '$lib/components/forms/inputs/quill-input.svelte';
	import type { BlogPost } from '@prisma/client';

	export let post: BlogPost = {} as BlogPost;
</script>

<div class="grid two-column-grid responsive gap-medium">
	<Box title="Datos obligatorios" icon="info-circle">
		<Input
			label="Titulo"
			name="title"
			type="text"
			placeholder="Titulo del post"
			value={post.title}
			required
		/>

		<QuillInput
			label="Contenido"
			name="content"
			placeholder="Contenido del post"
			value={post.content}
			required
		/>
	</Box>
</div>
