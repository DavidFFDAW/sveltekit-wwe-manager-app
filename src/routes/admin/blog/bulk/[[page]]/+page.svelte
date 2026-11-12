<script lang="ts">
	let { data } = $props();
	let formState = $state({});
	const formSubmit = (event: Event) => {
		event.preventDefault();
		const datas = new FormData(event.currentTarget as HTMLFormElement);
		const entries = Object.fromEntries(datas.entries());
		console.warn('Form submitted', entries);
		formState = entries;
	};
</script>

{#if formState && Object.keys(formState).length > 0}
	<pre>{JSON.stringify(formState, null, 4)}</pre>
{/if}

<div class="bulk-page">
	<header>
		<div>
			<h1>Edición masiva de posts</h1>
			<p>Edita el título, la imagen y los datos de publicación de cada post.</p>
		</div>
		<a href="/admin/blog">Volver al blog</a>
	</header>

	<form method="post" onsubmit={formSubmit}>
		<div class="toolbar">
			<span
				>{data.pagination.total} posts · Página {data.pagination.current} de {Math.max(
					1,
					data.pagination.pages
				)}</span
			>
			<button type="submit">Guardar cambios</button>
		</div>
		<p class="save-note">El guardado estará disponible cuando se conecte la acción del servidor.</p>

		<div class="post-list">
			<div class="column-headings" aria-hidden="true">
				<span>Título</span><span>Imagen</span><span>Visible</span><span>Estado</span><span
					>Categoría</span
				><span>Publicación</span>
			</div>
			{#each data.posts as post, index (post.id)}
				<fieldset class="post-row">
					<legend class="sr-only">Post {index + 1}: {post.title}</legend>
					<input type="hidden" name="posts[{index}][id]" value={post.id} />
					<label>
						<span class="field-label">Título</span>
						<input type="text" name="posts[{index}][title]" bind:value={post.title} />
					</label>
					<div class="image-field">
						<label>
							<span class="field-label">Imagen</span>
							<input
								type="text"
								name="posts[{index}][image]"
								bind:value={post.image}
								placeholder="URL de la imagen"
							/>
						</label>
						{#key post.image}
							{#if post.image?.trim()}
								<img
									src={post.image}
									alt="Vista previa de {post.title}"
									loading="lazy"
									onerror={(event) => {
										(event.currentTarget as HTMLImageElement).hidden = true;
									}}
								/>
							{:else}
								<span class="no-image">Sin imagen</span>
							{/if}
						{/key}
					</div>
					<label class="visibility-field">
						<span class="field-label">Visible</span>
						<input
							type="checkbox"
							name="posts[{index}][visible]"
							value="true"
							bind:checked={post.visible}
						/>
					</label>
					<label>
						<span class="field-label">Estado</span>
						<select name="posts[{index}][status]" bind:value={post.status}>
							<option value="published">Publicado</option>
							<option value="draft">Draft</option>
						</select>
					</label>
					<label>
						<span class="field-label">Categoría</span>
						<input type="text" name="posts[{index}][category]" bind:value={post.category} />
					</label>
					<label>
						<span class="field-label">Fecha de publicación</span>
						<input
							type="date"
							name="posts[{index}][created_at]"
							value={post.created_at ? new Date(post.created_at).toISOString().slice(0, 10) : ''}
						/>
					</label>
				</fieldset>
			{:else}
				<p class="empty-state">No hay posts en esta página.</p>
			{/each}
		</div>
	</form>

	<nav class="pagination" aria-label="Paginación de posts">
		{#if data.pagination.hasPrev}
			<a href="/admin/blog/bulk/{data.pagination.current - 1}">← Anterior</a>
		{/if}
		<span aria-current="page">Página {data.pagination.current}</span>
		{#if data.pagination.hasNext}
			<a href="/admin/blog/bulk/{data.pagination.current + 1}">Siguiente →</a>
		{/if}
	</nav>
</div>

<style>
	.bulk-page {
		color: #172033;
		min-width: 0;
	}
	header,
	.toolbar,
	.pagination {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		flex-wrap: wrap;
	}
	h1 {
		margin: 0;
	}
	header p,
	.save-note {
		color: #667085;
		font-size: 0.9rem;
	}
	a {
		color: #215cc5;
	}
	form {
		margin-top: 24px;
	}
	.toolbar {
		font-size: 0.9rem;
	}
	button {
		padding: 12px 18px;
		border: 0;
		border-radius: 8px;
		font: inherit;
	}
	button:disabled {
		background: #e4e7ec;
		color: #667085;
		cursor: not-allowed;
	}
	.save-note {
		margin: 10px 0 20px;
	}
	.post-list {
		border: 1px solid #e4e7ec;
		border-radius: 12px;
		overflow: hidden;
		background: white;
	}
	.column-headings,
	.post-row {
		display: grid;
		grid-template-columns:
			minmax(180px, 2fr) minmax(170px, 1.5fr) 64px minmax(115px, 1fr) minmax(120px, 1fr)
			155px;
		gap: 16px;
		padding: 18px;
	}
	.column-headings {
		background: #f3f5f8;
		font-size: 0.8rem;
		font-weight: 600;
		color: #475467;
	}
	.post-row {
		margin: 0;
		min-width: 0;
		border: 0;
		border-top: 1px solid #e4e7ec;
		align-items: start;
	}
	label,
	.image-field {
		display: flex;
		flex-direction: column;
		gap: 8px;
		min-width: 0;
	}
	.field-label {
		font-size: 0.8rem;
		font-weight: 600;
		color: #475467;
	}
	input:not([type='checkbox']),
	select {
		width: 100%;
		min-width: 0;
		box-sizing: border-box;
		padding: 10px;
		min-height: 42px;
		border: 1px solid #d0d5dd;
		border-radius: 7px;
		background: white;
		color: #172033;
		font: inherit;
		font-size: 0.875rem;
	}
	input[type='checkbox'] {
		width: 20px;
		height: 20px;
		margin: 11px 0;
		accent-color: #215cc5;
	}
	img {
		width: 100%;
		max-width: 180px;
		height: 90px;
		object-fit: contain;
		border-radius: 6px;
		background: #f3f5f8;
	}
	.no-image {
		color: #667085;
		font-size: 0.8rem;
		padding: 12px 0;
	}
	.pagination {
		justify-content: center;
		margin-top: 24px;
		font-size: 0.9rem;
	}
	.pagination a {
		padding: 10px 14px;
		border: 1px solid #d0d5dd;
		border-radius: 8px;
		text-decoration: none;
	}
	.empty-state {
		padding: 32px 16px;
		text-align: center;
		color: #667085;
	}
	input:focus-visible,
	select:focus-visible,
	a:focus-visible {
		outline: 3px solid #7da6ef;
		outline-offset: 2px;
	}
	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
	}
	@media (min-width: 1200px) {
		.field-label {
			position: absolute;
			width: 1px;
			height: 1px;
			overflow: hidden;
			clip-path: inset(50%);
		}
	}
	@media (max-width: 1199px) {
		.column-headings {
			display: none;
		}
		.post-list {
			border: 0;
			background: transparent;
			display: grid;
			gap: 16px;
		}
		.post-row {
			grid-template-columns: repeat(2, minmax(0, 1fr));
			border: 1px solid #e4e7ec;
			border-radius: 12px;
			background: white;
		}
		.visibility-field {
			flex-direction: row;
			align-items: center;
		}
	}
	@media (max-width: 540px) {
		.post-row {
			grid-template-columns: minmax(0, 1fr);
		}
	}
</style>
