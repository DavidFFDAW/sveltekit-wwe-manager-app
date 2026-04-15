<script lang="ts">
	import { Utils } from '$lib/utils/general.utils.js';
	import { slide } from 'svelte/transition';
	// import { tick } from 'svelte';

	let { data } = $props();
	let post = $state(data.upsert.post);
	let slug = $derived(Utils.slugify(post?.title || ''));
	let showGenerateIA = $state(false);
	// let blockAiDiv = $state<HTMLDivElement | null>(null);

	$effect(() => {
		post = data.upsert.post;
	});

	const toggleClickIA = () => {
		showGenerateIA = !showGenerateIA;
	};
</script>

<button type="button" class="w1 btn icon cta" onclick={toggleClickIA}>
	<i class="bi bi-robot"></i>
	<span>Abrir bloque de generación con IA</span>
</button>

<div class="w1 box flex column gap-smaller blog-upsert-datas down">
	<div class="w1">
		<input type="text" bind:value={post.title} placeholder="Título del post" />
		<small class="text-muted">{slug}</small>
	</div>

	<input type="text" value={post.exceptr} placeholder="Extracto del post" />
	<textarea bind:value={post.content} placeholder="Contenido del post"></textarea>

	<input type="number" name="views" value={post.views} placeholder="Número de vistas" />

	<label>
		<span>Visible</span>
		<input type="checkbox" name="visible" checked={post.visible} />
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
</div>

{#if showGenerateIA}
	<div class="w1 box blog-ia-generate-block down" transition:slide={{ duration: 120 }}>
		<p>
			Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nihil soluta doloremque eveniet
			incidunt placeat impedit voluptate, vitae voluptas? Laborum alias officiis sunt cupiditate? Ea
			quidem voluptas corrupti eos facere quae.
		</p>
	</div>
{/if}
