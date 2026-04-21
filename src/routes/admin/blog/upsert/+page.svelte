<script lang="ts">
	import AsyncForm from '$lib/components/forms/async-form.svelte';
	import { Utils } from '$lib/utils/general.utils.js';
	import { slide } from 'svelte/transition';
	// import { tick } from 'svelte';

	let { data } = $props();
	let post = $state(data.upsert.post);
	let provider = $state('groq');
	let slug = $derived(Utils.slugify(post?.title || ''));

	let images = $state<{ url: string; name: string }[]>([]);
	// let blockAiDiv = $state<HTMLDivElement | null>(null);

	$effect(() => {
		post = data.upsert.post;
	});

	const handleGetImages = async (event: Event) => {
		event.preventDefault();
		const form = event.target as HTMLFormElement;
		const formData = new FormData(form);
		const query = formData.get('image_query') as string;
		if (!query) return;

		try {
			const response = await fetch(
				`/api/images?provider=google&search=${encodeURIComponent(query)}`
			);
			if (!response.ok) throw new Error('Error al buscar imágenes');

			const data = await response.json();
			console.log({ data });
			images = data.images; // Asegúrate de que la respuesta tenga esta estructura
		} catch (error) {
			console.error('Error al obtener imágenes:', error);
		}
	};

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
		showButtons={false}
		classes="w1 form-upsert-blog-post"
	>
		<div class="w1 box flex column gap-smaller blog-upsert-datas">
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

				<input type="text" name="title" bind:value={post.title} placeholder="Título del post" />
				<input type="hidden" name="slug" value={slug} />
				<small class="text-muted">{slug}</small>
			</div>

			<input type="text" name="excerpt" value={post.exceptr} placeholder="Extracto del post" />
			<textarea bind:value={post.content} name="content" placeholder="Contenido del post"
			></textarea>

			<input type="number" name="views" value={post.views} placeholder="Número de vistas" />

			<label>
				<span>Visible</span>
				<input type="checkbox" name="visible" checked={post.visible} value="visible" />
			</label>

			<label class="relative">
				<input
					type="checkbox"
					class="app-radio app-checkbox"
					name="autodelete"
					bind:checked={post.deletable}
					value="deletable"
				/>
				<span class="radio-check-inner inner">Autoborrado</span>
			</label>

			<input type="text" name="category" value={post.category} placeholder="Categoría del post" />
			<input type="text" name="status" value={post.status} placeholder="Estado del post" />
			<input type="text" name="image" value={post.image} placeholder="Imagen del post" />

			<select name="author" value={data.upsert.post_author}>
				<option value={0} disabled>Selecciona un autor</option>
				{#each data.upsert.authors as author}
					<option value={author.id}>{author.name}</option>
				{/each}
			</select>

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

	<div
		class="w1 box blog-ia-generate-block flex column astart gap-5"
		transition:slide={{ duration: 120 }}
	>
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

	<div class="w1 box blog-images-box">
		<form action="" onsubmit={handleGetImages}>
			<input type="text" name="image_query" placeholder="Buscar imágenes" />
			<button type="submit" class="btn icon" aria-label="Buscar imágenes">
				<i class="bi bi-search"></i>
			</button>
		</form>

		<ul class="w1 images-list">
			{#each images as image}
				<li>
					<img src={image.url} alt={image.name} />
					<span>{image.name}</span>
				</li>
			{/each}
		</ul>
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
	.app-checkbox:checked + .inner.radio-check-inner {
		color: #fff;
		box-shadow: none;
		background-color: #d32f2f;
		border: 1px solid #d32f2f;
	}
	textarea {
		padding: 10px;
		font-size: 1rem;
		min-height: 200px;
		border-radius: 4px;
		border: 1px solid #ccc;
	}
</style>
