<script lang="ts">
	import AsyncForm from '$lib/components/forms/async-form.svelte';
	import Input from '$lib/components/forms/inputs/input.svelte';
	import Debug from '$lib/components/visual/debug.svelte';

	let { data } = $props();
	const post = $state(data.post);
</script>

<div class="page flex column start astart total gap">
	<header class="page-header">
		<h1>Notificaciones</h1>
		<small>Enviar notificaciones a los suscriptores para este post</small>
	</header>

	<div class="w1 preview flex gap-medium acenter box">
		<img src={post.image} alt={post.title} class="rounded" width="150" height="150" />
		<div class="w1 preview-texts flex column start astart gap-5">
			<h2>{post.title}</h2>
			<small>{post.exceptr}</small>
		</div>
	</div>

	<section class="w1 blog-post-notification-section">
		<AsyncForm
			method="post"
			showButtons={false}
			classes="w1 grid grid-two-column gap-smaller blog-post-notification-datas box"
		>
			<Input
				type="text"
				name="emailSubject"
				label="Asunto del correo"
				placeholder="Asunto del correo de notificación"
				value={`Nuevo post en el blog: ${post.title}`}
			/>

			<textarea
				name="emailPreheader"
				placeholder="Preheader del correo de notificación"
				bind:value={post.exceptr}
				class="w1 textarea"
			></textarea>

			<button type="submit" class="btn cta icon icon-gap-5">
				<i class="bi bi-send-fill"></i>
				Enviar correo
			</button>
		</AsyncForm>
	</section>
</div>

<!-- <Debug datas={data.subscribers} /> -->

<form action="" method="post"></form>
