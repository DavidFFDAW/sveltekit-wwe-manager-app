<script lang="ts">
	import AsyncForm from '$lib/components/forms/async-form.svelte';
	import QuillInput from '$lib/components/forms/inputs/quill-input.svelte';
	import { Toast } from '$lib/utils/toast.helper';

	let { data } = $props();
	let selectedNight = $state(data.nights[0] || 1);
	let matches = $derived(data.matches[selectedNight]);

	const copyToClipboard = async () => {
		const textContent = matches
			.map((item, index) => {
				let text = `${index + 1}. ${item.participants}`;
				if (item.championship) text += `\n - Championship: ${item.championship}`;
				if (item.winner) text += `\n - Winner: ${item.winner}`;
				if (item.stipulation) text += `\n - Stipulation: ${item.stipulation}`;
				if (item.notes) text += `\n - Notes: ${item.notes}`;
				return text.trim();
			})
			.filter(Boolean)
			.join('\n\n');

		try {
			await navigator.clipboard.writeText(textContent || '');
			Toast.success('Datos copiados al portapapeles');
		} catch {
			Toast.error('Error al copiar al portapapeles');
		}
	};
</script>

<header class="page-header">
	<h1>Resumen de matchcards</h1>
	<small>Aquí puedes ver un resumen de esta matchcard</small>
</header>

<section class="page-container">
	{#if data.hasMultipleNights}
		<header class="w1 nights-container">
			{#each data.nights as night}
				<label class="form-label relative">
					<input type="radio" class="app-radio" bind:group={selectedNight} value={night} />
					<span class="label inner">Noche {night}</span>
				</label>
			{/each}
		</header>
	{/if}

	<div class="w1 page-summary-list flex start astart column gap-5 copiable">
		<h2 class="uppercase">Noche {selectedNight}</h2>

		{#each matches as match}
			<div class="w1 page-summary-item box gap-smaller">
				<strong>{match.stipulation}:</strong>
				{#if match.championship}
					(<span class="championship">{match.championship}</span>)
				{/if}
				<span class="match-participants">{match.participants}</span>
				{#if match.winner}
					<p class="winner">- Ganador: {match.winner}</p>
				{/if}
				<label class="form-item">
					<span class="form-label label">Notas:</span>
					<textarea class="notes" placeholder="Notas del combate..." bind:value={match.notes}
					></textarea>
				</label>
			</div>
		{/each}
	</div>

	{#if data.ppv.post && data.hasLinkedPost}
		<a href={`/admin/blog/edit/${data.ppv.post}`} class="post-link btn icon rounded secondary cta">
			<i class="bi bi-file-earmark-text"></i>
			<span>Editar post relacionado</span>
		</a>
	{:else}
		<AsyncForm method="post" showButtons={false} redirect="/admin/blog" updateId={data.ppv.id}>
			<input type="hidden" name="date" value={data.ppv.date?.toISOString().split('T')[0]} />
			<input type="hidden" name="image" value={data.ppv.image} />
			<input type="hidden" name="name" value={data.ppv.name} />
			<input type="hidden" name="action" value="create_summary" />

			<div class="w1 box create-summary-post">
				<header class="title-block flex start acenter gap-smaller pointer">
					<i class="bi bi-card-text text-2xl"></i>
					<h2 class="box-title">Crear resumen</h2>
				</header>

				<div class="post-info">
					<p>
						Para crear un post relacionado con esta matchcard, recomendamos pulsar en el botón de
						"copiar" para copiar el contenido de la matchcard y después acceder a <a
							href="https://chatgpt.com/g/g-p-67aaf80f33908191bb5ffab06d85b978-wwe/c/9b2d8a04-cd8a-4fb1-9e0f-f76bc23a0479"
							class="link"
							target="_blank"
							rel="noopener noreferrer">ChatGPT</a
						> para generar un resumen del evento. Una vez tengas el resumen, pégalo en el campo de contenido
						y pulsa en "Crear post".
					</p>

					<div class="w1 buttons flex total astart responsive gap-smaller">
						<button class="btn rounded cta icon" type="button" onclick={copyToClipboard}>
							<i class="bi bi-clipboard"></i>
							<span>Copiar</span>
						</button>

						<a
							class="btn rounded icon chatgpt-btn"
							href="https://chatgpt.com/g/g-p-67aaf80f33908191bb5ffab06d85b978-wwe/c/9b2d8a04-cd8a-4fb1-9e0f-f76bc23a0479"
							target="_blank"
							rel="noopener noreferrer"
						>
							<i class="bi bi-chat-dots"></i>
							Accede a ChatGPT
						</a>
					</div>

					<QuillInput
						label="Contenido"
						name="content"
						placeholder="Escribe aquí el contenido del post relacionado con esta matchcard..."
						value=""
						required
					/>
					<div class="w1 flex down between acenter gap-smaller">
						<button class="btn rounded secondary" type="reset">Cancelar</button>
						<button class="btn rounded cta" type="submit">Crear post</button>
					</div>
				</div>
			</div>
		</AsyncForm>
	{/if}
</section>

<style>
	.page-container {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}
	.page-summary-item label.form-item {
		margin-top: 10px;
		gap: 2px;
	}
	.page-summary-item label.form-item textarea {
		width: 100%;
		min-height: 50px;
		padding: 8px;
		border: 1px solid #ccc;
		border-radius: 4px;
		resize: vertical;
	}
	.create-summary-post .post-info {
		display: flex;
		padding: 10px 0;
		flex-direction: column;
		align-items: start;
		justify-content: start;
		margin-top: 10px;
		gap: 20px;
	}
	.flex.buttons > * {
		flex: 1;
		width: 100%;
	}
	a.link {
		color: #193453;
		text-decoration: underline;
	}
	header.nights-container {
		margin-bottom: 20px;
		display: flex;
		gap: 5px;
	}
	header.nights-container label {
		flex: 1;
		cursor: pointer;
	}
	header.nights-container label input + .label.inner {
		width: 100%;
		display: inline-block;
		text-align: center;
		background-color: #fff;
		border: 1px solid #ccc;
		color: #333;
		padding: 5px 10px;
		border-radius: 50px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}
	header.nights-container label input:checked + .label.inner {
		background-color: #333;
		border-color: #333;
		color: #fff;
	}

	.buttons.flex > .btn {
		padding: 6px 10px;
		font-size: 0.9rem;
		background-color: #55759a;
	}
	.buttons.flex > .btn.chatgpt-btn {
		min-width: 200px;
		text-align: center;
		border-radius: 50px;
		background-color: #19a974;
		border-color: #19a974;
		color: #fff;
	}
</style>
