<script lang="ts">
	import AsyncForm from '$lib/components/forms/async-form.svelte';
	import ToggleInput from '$lib/components/forms/inputs/toggle-input.svelte';
	import Debug from '$lib/components/visual/debug.svelte';
	let { data } = $props();
	let loading = $state(false);

	function confirmAction(event: Event) {
		if (!confirm('¿Estás seguro de que deseas realizar esta acción?')) event.preventDefault();
	}
</script>

<Debug datas={loading} full={false} />

<div class="page-content">
	<header class="page-header">
		<h1>Revisar posts</h1>
		<small>Revisa y gestiona posts integrados directamente desde chatgpt</small>
	</header>

	<AsyncForm bind:loading action="update" method="post" showButtons={false}>
		<div class="posts-list-container">
			{#each data.list as post}
				<div class="post post-item post-list-item">
					<input type="hidden" name="post_ids[]" value={post.id} />
					<label>
						<span>Titulo</span>
						<input
							type="text"
							name="post[{post.id}][title]"
							placeholder="Titulo del post"
							value={post.title}
						/>
					</label>

					<label>
						<span>Fecha</span>
						<input
							type="date"
							name="post[{post.id}][date]"
							placeholder="Fecha de publicación"
							value={post.created_at.getCustomIsoFormat()}
						/>
					</label>

					<ToggleInput label="Publicado" name="post[{post.id}][published]" checked={false} />

					<button
						type="submit"
						class="btn icon small danger"
						name="delete"
						value={post.id}
						formaction="?/delete"
						aria-label="Borrar post"
						onclick={confirmAction}
					>
						<i class="bi bi-trash"></i>
					</button>
				</div>
			{/each}
		</div>

		<div class="form-actions form-buttons-container single-button">
			<button type="submit" class="btn icon primary" class:loading>
				<i class="bi bi-save"></i>
				Actualizar posts
			</button>
		</div>
	</AsyncForm>
</div>

<style>
	.page-content {
		margin: 0 auto;
		max-width: 1200px;
	}
	.posts-list-container {
		display: flex;
		flex-direction: column;
		padding: 1rem 0;
		gap: 10px;
	}
	.posts-list-container .post.post-item {
		width: 100%;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		align-items: center;
		padding: 1rem;
		gap: 1rem;

		background: #fff;
		border-radius: 8px;
		box-shadow:
			0 2px 4px rgba(0, 0, 0, 0.1),
			0 4px 8px rgba(0, 0, 0, 0.05);
	}

	.form-actions.form-buttons-container {
		display: flex;
		justify-content: center;
	}
	.form-actions.form-buttons-container.single-button {
		justify-content: flex-end;
	}
</style>
