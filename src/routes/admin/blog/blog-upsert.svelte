<script lang="ts">
	import Box from '$lib/components/box/box.svelte';
	import ImageInput from '$lib/components/forms/inputs/image-input.svelte';
	import Input from '$lib/components/forms/inputs/input.svelte';
	import QuillInput from '$lib/components/forms/inputs/quill-input.svelte';
	import RadioList from '$lib/components/forms/inputs/radio-list.svelte';
	import { Utils } from '$lib/utils/general.utils';
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
			bind:value={post.title}
			required
		/>

		<Input
			label="Slug"
			name="slug"
			type="text"
			placeholder="Slug del post"
			bind:value={post.slug}
			required
		/>

		<ImageInput
			label="Imagen"
			name="image"
			placeholder="Imagen del post"
			image={post.image as string}
			required
		/>

		<QuillInput
			label="Contenido"
			name="content"
			placeholder="Contenido del post"
			value={post.content}
			required
		/>

		<Input
			label="Fecha de publicacion"
			name="publishedAt"
			type="date"
			value={post.created_at ? post.created_at.toISOString().split('T')[0] : ''}
			required
		/>
	</Box>

	<Box title="Datos opcionales" icon="info-circle">
		<div class="form-item">
			<label for="excerpt" class="label form-label">Descripcion (Excerpt)</label>
			<textarea
				name="excerpt"
				placeholder="Descripción del post"
				bind:value={post.exceptr as string}
			></textarea>
		</div>

		<RadioList
			label="Estado"
			name="is_published"
			options={[
				{ label: 'Publicado', value: 'true' },
				{ label: 'Borrador', value: 'false' }
			]}
			value={post.visible ? 'true' : 'false'}
		/>

		<RadioList
			label="¿Borrado automatico?"
			name="auto_delete"
			options={[
				{ label: 'Si', value: 'true' },
				{ label: 'No', value: 'false' }
			]}
			value={post.deletable ? 'true' : 'false'}
		/>
	</Box>
</div>
