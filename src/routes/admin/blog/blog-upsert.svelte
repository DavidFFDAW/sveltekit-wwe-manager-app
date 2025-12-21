<script lang="ts">
	import Box from '$lib/components/box/box.svelte';
	import Dialog from '$lib/components/dialog/dialog.svelte';
	import AsyncForm from '$lib/components/forms/async-form.svelte';
	import ImageInput from '$lib/components/forms/inputs/image-input.svelte';
	import Input from '$lib/components/forms/inputs/input.svelte';
	import QuillInput from '$lib/components/forms/inputs/quill-input.svelte';
	import RadioList from '$lib/components/forms/inputs/radio-list.svelte';
	import Icon from '$lib/components/icons/icon.svelte';
	import { Utils } from '$lib/utils/general.utils';
	import type { BlogPost } from '@prisma/client';
	import { onMount } from 'svelte';
	import BlogIaForm from './blog-ia-form.svelte';
	import DateInput from '$lib/components/forms/date/date-input.svelte';

	let {
		post = {}
	}: {
		post: Partial<BlogPost>;
		iaPopupOpened?: boolean;
	} = $props();

	let iaPopupOpened = $state(false);
	let title = $state(post.title || '');
	let content = $state(post.content || '');
	let date: Date = $state(post.created_at || new Date());
	let slug = $derived(Utils.slugify(title));
	let isUpdate = $derived(Boolean(post && post.id));
	let CoverImageComponent: any = $state(null);
	const currentYear = new Date().getFullYear();

	onMount(() => {
		import('$lib/components/forms/inputs/cover-image.svelte').then((module) => {
			CoverImageComponent = module.default;
		});
	});
</script>

<AsyncForm
	redirect="/admin/blog"
	method={isUpdate ? 'put' : 'post'}
	buttonText={isUpdate ? 'Guardar cambios' : 'Crear post'}
	updateId={isUpdate ? post.id : undefined}
>
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

			<Input
				label="Slug"
				name="slug"
				type="text"
				placeholder="Slug del post"
				value={slug}
				required
			/>

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
					value={content}
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

			<DateInput
				label="Fecha de publicacion"
				name="published_at"
				min={`${currentYear - 2}-01-01`}
				max={`${currentYear + 1}-12-31`}
				value={date.toISOString().split('T')[0]}
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

		<!-- <div class="grid-cover-image-component-item">
			<Box title="Imagen de portada" icon="image">
				{#if CoverImageComponent}
					<CoverImageComponent value={(post.image as string) || ''} />
				{/if}
			</Box>
		</div> -->
	</div>
</AsyncForm>

<Dialog
	bind:opened={iaPopupOpened}
	title="Generar contenido del post con IA"
	class="ia-text-generate-dialog auto-adjust-height"
>
	<BlogIaForm bind:content onaftersubmit={() => (iaPopupOpened = false)} />
</Dialog>

<div class="blog-upsert-dialog-buttons-container">
	<button
		type="button"
		onclick={() => (iaPopupOpened = true)}
		aria-label="Generar contenido del post con IA"
		class="blog-upsert-dialog-buttons-item btn cta"
	>
		<i class="bi bi-openai"></i>
	</button>

	<button
		type="button"
		aria-label="Abrir panel de gestión de imágenes"
		class="blog-upsert-dialog-buttons-item btn secondary"
	>
		<i class="bi bi-image"></i>
	</button>
</div>

<style>
	.blog-upsert-dialog-buttons-container {
		max-width: 60px;
		position: fixed;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 6px;
		right: 0;
		bottom: 60px;
		z-index: 50;
		padding: 5px;
		background-color: #fff;
		border-radius: 6px 0 0 6px;
		box-shadow: 0 0px 18px rgba(0, 0, 0, 0.2);
	}

	.blog-upsert-dialog-buttons-container .blog-upsert-dialog-buttons-item {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 6px 10px;
		font-size: 16px;
	}
</style>
