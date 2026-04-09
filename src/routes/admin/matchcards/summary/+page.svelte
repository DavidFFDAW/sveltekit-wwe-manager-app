<script lang="ts">
	import { Toast } from '$lib/utils/toast.helper';
	let { data } = $props();

	const copyToClipboard = async () => {
		const content = document.querySelectorAll('.copiable .page-summary-item');
		const textContent = data.matches
			.map((item, index) => {
				const championship = item.championship ? `(${item.championship})` : '';
				const winner = item.winner ? `- Ganador: ${item.winner}` : '';
				let m = `${index + 1}. ${item.stipulation} ${championship}: ${item.participants}.`;
				if (winner) m += ` Gana el combate ${winner}`;
				return m.trim();
			})
			.filter(Boolean)
			.join('\n');

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
	<small>Aquí puedes ver un resumen de esta matchcard.</small>
</header>

<section class="page-container">
	<div class="w1 page-summary-list flex start astart column gap-5 copiable">
		{#each data.matches as match}
			<div class="w1 page-summary-item box gap-smaller">
				<strong>{match.stipulation}:</strong>
				{#if match.championship}
					(<span class="championship">{match.championship}</span>)
				{/if}
				<span class="match-participants">{match.participants}</span>
				{#if match.winner}
					<p class="winner">- Ganador: {match.winner}</p>
				{/if}
				<p class="night">- Noche: {match.night}</p>
			</div>
		{/each}
	</div>

	<div class="w1 buttons flex total astart responsive gap-smaller">
		<button class="btn rounded cta icon" type="button" onclick={copyToClipboard}>
			<i class="bi bi-clipboard"></i>
			<span>Copiar</span>
		</button>

		<a
			class="btn rounded cta icon"
			href="https://chatgpt.com/g/g-p-67aaf80f33908191bb5ffab06d85b978-wwe/c/9b2d8a04-cd8a-4fb1-9e0f-f76bc23a0479"
			target="_blank"
			rel="noopener noreferrer"
		>
			<i class="bi bi-chat-dots"></i>
			Resume con ChatGPT
		</a>

		<a href="/admin/blog/create" class="btn rounded cta icon">
			<i class="bi bi-file-earmark-plus"></i>
			Crear un nuevo post
		</a>
	</div>
</section>

<style>
	.flex.buttons {
		margin-top: 25px;
	}
	.flex.buttons > * {
		flex: 1;
		width: 100%;
	}
</style>
