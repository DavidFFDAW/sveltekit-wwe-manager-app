<script lang="ts">
	import AsyncForm from '$lib/components/forms/async-form.svelte';
	import ToggleInput from '$lib/components/forms/inputs/toggle-input.svelte';

	let loading = $state(false);
	let { data } = $props();

	function confirmAction(event: Event) {
		if (!confirm('¿Estás seguro de que deseas realizar esta acción?')) event.preventDefault();
	}
</script>

<div class="page-content">
	<header class="page-header">
		<h1>Revisar posts</h1>
		<small>Revisa y gestiona posts integrados directamente desde chatgpt</small>
	</header>

	<AsyncForm bind:loading action="update" method="post" showButtons={false}>
		<div class="posts-list-container">
			<div class="list-heading" aria-hidden="true">
				<span>Post / título</span>
				<span>Fecha de publicación</span>
				<span>Publicado</span>
				<span class="actions-heading">Borrar</span>
			</div>
			{#each data.list as post}
				<div class="post post-item post-list-item">
					<input type="hidden" name="post_ids[]" value={post.id} />

					<div class="post-fields">
						<label class="title-field">
							<span class="field-label">Título</span>
							<input
								type="text"
								name="post[{post.id}][title]"
								placeholder="Titulo del post"
								value={post.title}
							/>
							{#if post.title.length > 150}
								<small class="post-title-warning">El título es demasiado largo</small>
							{/if}
						</label>

						<label>
							<span class="field-label">Fecha de publicación</span>
							<input
								type="date"
								name="post[{post.id}][date]"
								placeholder="Fecha de publicación"
								value={post.created_at!.getCustomIsoFormat()}
							/>
						</label>

						<div class="published-field">
							<ToggleInput label="Publicado" name="post[{post.id}][published]" checked={false} />
						</div>

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
	.page-header {
		padding: 24px 0;
	}
	.page-header h1 {
		margin: 0 0 6px;
	}
	.page-header small {
		color: #737987;
	}
	.posts-list-container {
		--post-columns: minmax(0, 1fr) 180px 110px 44px;
		border: 1px solid #e5e7ed;
		border-radius: 12px;
		background: #fff;
		box-shadow: 0 4px 20px #20243a05;
	}
	.list-heading,
	.post-fields {
		display: grid;
		grid-template-columns: var(--post-columns);
		align-items: center;
		gap: 20px;
		padding: 18px 20px;
	}
	.list-heading {
		background: #f7f8fb;
		border-radius: 12px 12px 0 0;
		color: #727889;
		font-size: 12px;
		font-weight: 600;
	}
	.actions-heading {
		text-align: center;
	}
	.post-item {
		border-top: 1px solid #eceef3;
	}
	.post-item:last-child {
		border-radius: 0 0 12px 12px;
	}
	.post-item:hover,
	.post-item:focus-within {
		background: #fafaff;
	}
	label {
		display: flex;
		flex-direction: column;
		min-width: 0;
		gap: 8px;
		margin: 0;
	}
	.field-label {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
	}
	input:not([type='hidden']) {
		min-width: 0;
		min-height: 42px;
		padding: 10px 12px;
		border-radius: 7px;
		border-color: #dfe2ea;
		background: #fff;
		color: #303545;
		font-size: 14px;
	}
	input:focus {
		border-color: color-mix(in srgb, var(--indigo) 45%, #ccc);
	}
	.published-field :global(.toggle-label) {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip-path: inset(50%);
	}
	.published-field :global(.toggle-container) {
		gap: 0;
	}
	.post-fields .btn.danger {
		width: 38px;
		height: 38px;
		justify-self: center;
		padding: 0;
		justify-content: center;
		border: 1px solid #f1dfe2;
		border-radius: 8px;
		background: #fff7f8;
		color: #bd4554;
		box-shadow: none;
	}
	.post-fields .btn.danger:hover {
		background: #fce7eb;
		border-color: #e6a7b1;
	}
	.post-title-warning {
		color: #a35e22;
		font-size: 12px;
		line-height: 1.4;
	}
	.form-actions.form-buttons-container {
		display: flex;
		justify-content: flex-end;
		padding: 20px 0;
	}
	.form-actions .btn {
		min-height: 42px;
		border-radius: 8px;
	}
	@media (max-width: 1000px) {
		.posts-list-container {
			--post-columns: minmax(0, 1fr) 155px 80px 38px;
		}
		.list-heading,
		.post-fields {
			gap: 12px;
			padding: 16px;
		}
	}
	@media (max-width: 700px) {
		.list-heading {
			display: none;
		}
		.post-fields {
			grid-template-columns: minmax(0, 1fr) auto 38px;
			gap: 18px 12px;
			align-items: end;
			padding: 20px 16px;
		}
		.list-heading + .post-item {
			border-top: 0;
		}
		.title-field {
			grid-column: 1 / -1;
		}
		.field-label,
		.published-field :global(.toggle-label) {
			position: static;
			width: auto;
			height: auto;
			margin: 0;
			overflow: visible;
			clip-path: none;
			white-space: normal;
			font-size: 12px;
			font-weight: 600;
			color: #727889;
		}
		.published-field :global(.toggle-container) {
			gap: 8px;
			padding-bottom: 8px;
		}
		.form-actions .btn {
			width: 100%;
			justify-content: center;
		}
	}
</style>
