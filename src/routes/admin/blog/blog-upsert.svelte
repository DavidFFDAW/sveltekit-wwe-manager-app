<script lang="ts">
	import Box from '$lib/components/box/box.svelte';
	import ImageInput from '$lib/components/forms/inputs/image-input.svelte';
	import Input from '$lib/components/forms/inputs/input.svelte';
	import QuillInput from '$lib/components/forms/inputs/quill-input.svelte';
	import RadioList from '$lib/components/forms/inputs/radio-list.svelte';
	import Icon from '$lib/components/icons/icon.svelte';
	import { Utils } from '$lib/utils/general.utils';
	import type { BlogPost } from '@prisma/client';
	import { onMount } from 'svelte';

	let {
		post = {},
		iaPopupOpened = $bindable(false)
	}: { post: Partial<BlogPost>; iaPopupOpened?: boolean } = $props();

	let title = $state(post.title || '');
	let CoverImageComponent: any = $state(null);
	let slug = $derived(Utils.slugify(title));

	onMount(() => {
		import('$lib/components/forms/inputs/cover-image.svelte').then((module) => {
			CoverImageComponent = module.default;
		});
	});
</script>

<div class="grid two-column-grid responsive gap-medium admin-panel">
	<Box title="Datos obligatorios" icon="info-circle">
		<Input
			label="Titulo"
			name="title"
			type="text"
			placeholder="Titulo del post"
			bind:value={title}
			required
		/>

		<Input label="Slug" name="slug" type="text" placeholder="Slug del post" value={slug} required />

		<ImageInput
			label="Imagen"
			name="image"
			placeholder="Imagen del post"
			image={(post.image as string) || ''}
		/>

		<div class="w1 quill-container flex column gap-5">
			<QuillInput
				label="Contenido"
				name="content"
				placeholder="Contenido del resumen"
				value={(post.content as string) || ''}
				required
			/>
			<!-- <IaTextarea
				label="Contenido"
				name="content"
				placeholder="Contenido del post"
				bind:value={post.content}
				required
			/> -->

			<div class="w1 total flex acenter gap-medium">
				<a
					href="https://chatgpt.com/c/9b2d8a04-cd8a-4fb1-9e0f-f76bc23a0479"
					target="_blank"
					class="w1 block btn secondary icon"
				>
					<Icon icon="openai" />
					Generar artículo con ChatGPT
				</a>

				<button type="button" onclick={() => (iaPopupOpened = true)} class="btn cta icon block">
					<i class="bi bi-robot"></i>
					<span>Generar contenido para artículo con IA</span>
				</button>
			</div>
		</div>

		<Input
			label="Fecha de publicacion"
			name="published_at"
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
				value={(post.exceptr as string) || ''}
			></textarea>
		</div>

		<RadioList
			label="Estado"
			name="post_status"
			options={[
				{ label: 'Publicado', value: 'published' },
				{ label: 'No publicado', value: 'unpublished' },
				{ label: 'Borrador', value: 'draft' }
			]}
			value={post.status || 'draft'}
		/>

		<RadioList
			label="¿Borrado automatico?"
			name="auto_delete"
			options={[
				{ label: 'Si', value: 'active' },
				{ label: 'No', value: 'inactive' }
			]}
			value={post.deletable ? 'active' : 'inactive'}
		/>
	</Box>

	<div class="grid-cover-image-component-item">
		<Box title="Imagen de portada" icon="image">
			{#if CoverImageComponent}
				<CoverImageComponent value={(post.image as string) || ''} />
			{/if}
		</Box>
	</div>
</div>

<style>
	@media only screen and (max-width: 900px) {
		.grid-cover-image-component-item {
			display: none;
		}
	}
	@media only screen and (max-width: 1116px) {
		.grid-cover-image-component-item {
			grid-column: span 2;
		}
	}
</style>
