<script lang="ts">
	import AsyncForm from '$lib/components/forms/async-form.svelte';
	import QuillInput from '$lib/components/forms/inputs/quill-input.svelte';
	import Gallery from '$lib/components/gallery/gallery.svelte';
	import Imgur from '$lib/components/modules/imgur/imgur.svelte';
	import GenerateIaBlock from './generate-ia-block.svelte';
	import { Utils } from '$lib/utils/general.utils.js';
	import { fade } from 'svelte/transition';
	import { tick } from 'svelte';

	let { data } = $props();
	let showIaBlock = $state(false);
	let post = $state(data.upsert.post);
	let slug = $derived(Utils.slugify(post?.title || ''));

	const updatePostDatas = (datas: Record<string, any>) => {
		post = { ...post, ...datas };
	};

	const scrollToGenerate = async () => {
		showIaBlock = true;
		await tick();

		const block = document.querySelector('.blog-ia-generate-block');
		if (block) block.scrollIntoView({ behavior: 'smooth', block: 'center' });
	};

	const handlePasteImageUrlFromClipboard = async () => {
		try {
			const text = await navigator.clipboard.readText();
			if (text) post.image = text;
		} catch (error) {
			console.error('Error al pegar desde el portapapeles:', error);
		}
	};

	$effect(() => {
		post = data.upsert.post;
	});
	// $inspect(data.upsert);
</script>

<div class="page-container flex column gap start astart total">
	<button type="button" class="w1 btn icon cta" onclick={scrollToGenerate}>
		<i class="bi bi-robot"></i>
		<span>Abrir bloque de generación con IA</span>
	</button>

	{#if showIaBlock}
		<div class="ia-block" transition:fade>
			<GenerateIaBlock models={data.upsert.iaModels} updateContent={updatePostDatas} />
		</div>
	{/if}

	<AsyncForm
		method="post"
		updateId={post.id}
		showButtons={true}
		classes="w1 form-upsert-blog-post grid grid-page-layout responsive"
	>
		<div class="main-layout">
			<div class="w1 box flex column gap-smaller blog-upsert-main-contents">
				<label class="label label-container relative">
					<span class="label-text">Titulo</span>
					<input type="text" name="title" bind:value={post.title} placeholder="Título del post" />
					<input type="hidden" name="slug" value={slug} />
					<small class="form-helper">{slug}</small>
				</label>

				<QuillInput
					label="Contenido"
					name="content"
					bind:value={post.content}
					placeholder="Contenido del post"
				/>

				<label class="label">
					<span class="label-text">Resumen</span>
					<textarea name="excerpt" bind:value={post.exceptr} placeholder="Extracto breve del post"
					></textarea>
				</label>

				<label class="label">
					<span class="label-text">Vistas</span>
					<input type="number" name="views" value={post.views} placeholder="Número de vistas" />
				</label>

				<!-- <div class="w1 flex between gap-5 buttons-container-item">
					<button type="reset" class="btn icon secondary icon-gap-5">
						<i class="bi bi-x-lg"></i>
						<span>Cancelar</span>
					</button>
					<button type="submit" class="btn icon cta icon-gap-5">
						<i class="bi bi-check-lg"></i>
						<span>Guardar</span>
					</button>
				</div> -->
			</div>

			<div class="w1 second-column-datas">
				<div class="box">
					<div class="image-container">
						<img src={post.image || '/noimage.jpg'} alt="Imagen del post" class="w1" />
						<label class="label" aria-label="URL de la imagen del post">
							<input
								type="text"
								name="image"
								bind:value={post.image}
								placeholder="URL de la imagen del post"
							/>
							<button
								type="button"
								class="btn btn-paste icon"
								onclick={handlePasteImageUrlFromClipboard}
								title="Pegar URL de imagen desde el portapapeles"
								aria-label="Pegar URL de imagen desde el portapapeles"
							>
								<i class="bi bi-clipboard"></i>
							</button>
						</label>

						<div class="w1 image-container-providers">
							<Gallery bind:value={post.image as string} />
							<Imgur bind:value={post.image as string} />
						</div>
					</div>

					<div class="w1 flex between gap-5 buttons-container-item">
						<label class="w1 relative flex start acenter gap-5">
							<input
								type="checkbox"
								class="app-checkbox-visible checkbox"
								name="visible"
								bind:checked={post.visible}
								value="visible"
							/>
							<span class="radio-check-inner inner featured">Visible</span>
						</label>

						<label class="w1 relative flex start acenter gap-5">
							<input
								type="checkbox"
								class="app-checkbox-visible checkbox"
								name="deletable"
								bind:checked={post.deletable}
								value="deletable"
							/>
							<span class="radio-check-inner inner featured">Autoborrado</span>
						</label>
					</div>
				</div>

				<div class="box">
					<label class="label">
						<span class="label-text">Estado</span>
						<select name="status" placeholder="Estado del post" value={post.status}>
							<option value="draft">Borrador</option>
							<option value="published">Publicado</option>
							<option value="private">Privado</option>
						</select>
					</label>

					<label class="label">
						<span class="label-text">Fecha de publicación</span>
						<input
							type="date"
							name="published_at"
							value={post.created_at}
							placeholder="Fecha de publicación del post"
						/>
					</label>

					<label class="label">
						<span class="label-text">Autor</span>
						<select
							name="author"
							placeholder="Autor del post"
							value={data.upsert.post_author as number}
						>
							<option value={''} disabled>Selecciona un autor</option>
							{#each data.upsert.authors as author}
								<option value={author.id}>{author.name}</option>
							{/each}
						</select>
					</label>

					<label class="label">
						<span class="label-text">Categorías</span>
						<input
							type="text"
							name="category"
							value={post.category}
							placeholder="Categorías del post (separadas por comas)"
						/>
					</label>
				</div>
			</div>
		</div>
	</AsyncForm>

	<div class="fixed right ia-content-reminder">
		<button
			type="button"
			class="btn ia-reminder-button"
			onclick={scrollToGenerate}
			aria-label="Abrir bloque de generación con IA"
			title="Abrir bloque de generación con IA"
		>
			<i class="bi bi-openai"></i>
		</button>
	</div>
</div>

<style>
	label.label {
		width: 100%;
		display: flex;
		position: relative;
		flex-direction: column;
		gap: 4px;
	}
	label.label span.label-text {
		font-size: 16px;
		font-weight: 600;
		text-transform: uppercase;
		color: #000;
	}
	label.label input,
	label.label textarea,
	label.label select {
		width: 100%;
		outline: none;
		font-size: 14px;
		font-family: 'sourcesans', sans-serif;
		background-color: #fff;
		border: 1px solid #ddd;
		border-radius: 5px;
		padding: 10px;
	}
	.page-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 20px 50px 20px;
	}
	input.app-checkbox-visible.checkbox {
		width: 20px;
		min-height: 20px;
	}
	.box {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: flex-start;
		background-color: #fff;
		border: 1px solid #ddd;
		padding: 16px;
		border-radius: 8px;
		box-shadow: none;
		gap: 16px;
	}
	.main-layout {
		display: grid;
		grid-template-columns: minmax(0, 1fr) 340px;
		align-items: stretch;
		gap: 16px;
		padding: 6px 0;
	}
	.main-layout .second-column-datas {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 16px;
	}
	.main-layout .second-column-datas .box {
		width: 100%;
		/* height: 100%; */
	}
	.main-layout .second-column-datas .image-container {
		width: 100%;
	}
	.main-layout .second-column-datas .image-container label {
		width: 100%;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		gap: 0;
	}
	.main-layout .second-column-datas .image-container img {
		width: 100%;
		max-width: 100%;
		max-height: 150px;
		height: auto;
		border-radius: 8px 8px 0 0;
		object-fit: cover;
	}
	.main-layout .second-column-datas .image-container label input {
		border-radius: 0 0 0 8px;
	}
	.main-layout .second-column-datas .image-container label button.btn-paste {
		display: block;
		border: 1px solid #ddd;
		border-radius: 0 0 8px 0;
		border-left: none;
		background: none;
		padding: 8px;
		cursor: pointer;
		color: #555;
	}
	.main-layout .second-column-datas .image-container .image-container-providers {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 8px;
		gap: 8px;
	}

	textarea {
		min-height: 80px;
	}

	.fixed.ia-content-reminder {
		position: fixed;
		background-color: #fff;
		border: 1px solid #333;
		border-right: none;
		border-radius: 4px 0 0 4px;
		padding: 8px 5px;
		bottom: 60px;
		right: 0px;
		z-index: 1000;
	}
	.fixed.ia-content-reminder .ia-reminder-button {
		color: #fff;
		background-color: #333;
		border: none;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 18px;
		font-weight: 100;
		padding: 6px;
		border-radius: 6px;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
		cursor: pointer;
	}

	@media only screen and (max-width: 768px) {
		.main-layout {
			grid-template-columns: 1fr;
		}
		.page-container {
			max-width: 1200px;
			margin: 0 auto;
			padding: 0 0 0 0;
		}
	}
</style>
