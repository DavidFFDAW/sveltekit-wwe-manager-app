<script lang="ts">
	import AsyncForm from '$lib/components/forms/async-form.svelte';
	import ImageInput from '$lib/components/forms/inputs/image-input.svelte';
	import Input from '$lib/components/forms/inputs/input.svelte';
	import QuillInput from '$lib/components/forms/inputs/quill-input.svelte';
	import Select from '$lib/components/forms/inputs/select.svelte';
	import { Utils } from '$lib/utils/general.utils.js';
	import { slide } from 'svelte/transition';
	// import { tick } from 'svelte';

	let { data } = $props();
	let post = $state(data.upsert.post);
	let provider = $state('groq');
	let slug = $derived(Utils.slugify(post?.title || ''));

	$effect(() => {
		post = data.upsert.post;
	});

	const sendToGenerate = async (event: Event) => {
		event.preventDefault();
		const form = event.target;
		if (!form || !(form instanceof HTMLFormElement)) return;

		const formData = new FormData(form);
		const provider = formData.get('provider') as string;
		const instructions = formData.get('prompt') as string;
		if (!instructions) return alert('Por favor, ingresa instrucciones para la IA.');

		try {
			const response = await fetch(`/api/blog/generate/${provider}`, {
				method: 'POST',
				headers: { 'Content-Type': 'multipart/form-data' },
				body: formData
			});
			if (!response.ok) throw new Error('Error al generar contenido con IA');

			const data = await response.json();
			console.log({ generatedContent: data });
			post.content = data.text; // Asegúrate de que la respuesta tenga esta estructura
		} catch (error) {
			console.error('Error al generar contenido con IA:', error);
		}
	};

	const setImage = (image: { url: string; name: string }) => (event: Event) => {
		event.preventDefault();
		post.image = image.url;
	};

	const scrollToGenerate = () => {
		const block = document.querySelector('.blog-ia-generate-block');
		if (block) block.scrollIntoView({ behavior: 'smooth', block: 'start' });
	};

	$inspect(data.upsert);
</script>

<button type="button" class="w1 btn icon cta" onclick={scrollToGenerate}>
	<i class="bi bi-robot"></i>
	<span>Abrir bloque de generación con IA</span>
</button>

<div class="page-container grid grid-page-layout responsive">
	<AsyncForm
		method="post"
		updateId={post.id}
		showButtons={true}
		classes="w1 form-upsert-blog-post grid grid-page-layout responsive"
	>
		<div class="w1 box flex column gap-smaller blog-upsert-datas">
			<ImageInput
				label="Imagen del post"
				name="image"
				bind:image={post.image as string}
				placeholder="URL de la imagen del post"
			/>

			<div class="w1">
				<p><strong>{data.upsert.view_performance}</strong></p>
				<p>
					<strong>Media de visitas de post:</strong>
					<span>{data.upsert.averageViews}</span>
				</p>
				<p>
					<strong>Rendimiento de vistas:</strong>
					<span>{data.upsert.view_percentage}%</span>
				</p>
			</div>

			<label class="form-item label-container relative">
				<span class="form-label label">Titulo</span>
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

			<textarea name="excerpt" bind:value={post.exceptr} placeholder="Extracto breve del post"
			></textarea>

			<input type="number" name="views" value={post.views} placeholder="Número de vistas" />

			<div class="w1 flex between acenter gap-5">
				<label class="relative block">
					<input
						type="checkbox"
						class="app-radio app-checkbox"
						name="visible"
						bind:checked={post.visible}
						value="visible"
					/>
					<span class="radio-check-inner inner visible">Visible</span>
				</label>

				<label class="relative block">
					<input
						type="checkbox"
						class="app-radio app-checkbox"
						name="autodelete"
						bind:checked={post.deletable}
						value="deletable"
					/>
					<span class="radio-check-inner inner deletable">Autoborrado</span>
				</label>
			</div>

			<Input
				label="Categoria"
				type="text"
				name="category"
				value={post.category}
				placeholder="Etiquetas del post (separadas por comas)"
			/>

			<Select name="status" label="Estado" value={post.status}>
				<option value="draft">Borrador</option>
				<option value="published">Publicado</option>
				<option value="archived">Archivado</option>
			</Select>

			<Select name="author" label="Autor" value={data.upsert.post_author as number}>
				<option value={''} disabled>Selecciona un autor</option>
				{#each data.upsert.authors as author}
					<option value={author.id}>{author.name}</option>
				{/each}
			</Select>

			<div class="w1 flex between gap-5 buttons-container-item">
				<button type="reset" class="btn icon secondary icon-gap-5">
					<i class="bi bi-x-lg"></i>
					<span>Cancelar</span>
				</button>
				<button type="submit" class="btn icon cta icon-gap-5">
					<i class="bi bi-check-lg"></i>
					<span>Guardar</span>
				</button>
			</div>
		</div>
	</AsyncForm>

	<div class="w1 box blog-ia-generate-block flex column astart gap-5">
		<header class="blog-ia-generate-title title-block flex start acenter gap-smaller pointer">
			<i class="bi bi-image"></i>
			<h2 class="box-title">Gestion imagenes</h2>
		</header>

		<ul>
			{#each data.upsert.images.list as image}
				<li>
					<button type="button" class="btn icon secondary icon-gap-5" onclick={setImage(image)}>
						<img
							width="80"
							height="80"
							src={image.url}
							alt={image.name}
							class="blog-image-preview"
						/>
					</button>
				</li>
			{/each}
		</ul>
	</div>

	<div class="w1 box blog-ia-generate-block flex column astart gap-5">
		<header class="blog-ia-generate-title title-block flex start acenter gap-smaller pointer">
			<i class="bi bi-robot"></i>
			<h2 class="box-title">Contenido con IA</h2>
		</header>

		<form class="w1 h1 flex column between astart gap" method="post" onsubmit={sendToGenerate}>
			<div>
				<p class="artificial-info">
					Por defecto esta inteligencia artificial va a recibir instrucciones para escribir un post
					para un blog de WWE sobre el tema concreto que le especifiques y lo devolverá en html sin
					utilizar las etiquetas <code>"body"</code>, <code>"html"</code> ni <code>"head"</code>.
					Solo el contenido. Tampoco incluirá el titular <code>"h1"</code> ni etiquetas
					<code>"script"</code>
					o
					<code>"style"</code>.
				</p>

				<textarea name="prompt" placeholder="Instrucciones para la IA"></textarea>

				<select name="provider" class="w1 select" bind:value={provider}>
					<option value="gemini">Gemini</option>
					<option value="groq">Groq</option>
					<option value="openai">OpenAI</option>
				</select>
			</div>

			<div class="w1 flex between acenter gap-5 buttons-container-item">
				<button type="button" class="btn icon secondary icon-gap-5">
					<i class="bi bi-x-lg"></i>
					<span>Cancelar</span>
				</button>

				<button type="submit" class="btn icon cta icon-gap-5">
					<i class="bi bi-check-lg"></i>
					<span>Generar</span>
				</button>
			</div>
		</form>
	</div>
</div>

<style>
	.grid.grid-page-layout {
		margin-top: 1rem;
		grid-template-columns: repeat(2, 1fr);
		gap: 1rem;
	}

	.app-checkbox + .inner.radio-check-inner {
		color: #d32f2f;
		border: 1px solid #d32f2f;
		border-radius: 50px;
		padding: 4px 20px;
		box-shadow: none;
		outline: none;
	}
	.app-checkbox + .inner.radio-check-inner.visible {
		border: 1px solid #4caf50;
		color: #4caf50;
	}

	.app-checkbox:checked + .inner.radio-check-inner {
		color: #fff;
		box-shadow: none;
		background-color: #d32f2f;
		border: 1px solid #d32f2f;
	}
	.app-checkbox:checked + .inner.radio-check-inner.visible {
		background-color: #4caf50;
		border: 1px solid #4caf50;
	}

	textarea {
		padding: 10px;
		font-size: 1rem;
		min-height: 200px;
		border-radius: 4px;
		border: 1px solid #ccc;
	}
</style>
