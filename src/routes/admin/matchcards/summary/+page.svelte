<script lang="ts">
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
				text += `\n - Notes:`;
				return text.trim();
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

	$inspect(data);
</script>

<header class="page-header">
	<h1>Resumen de matchcards</h1>
	<small>Aquí puedes ver un resumen de esta matchcard.</small>
</header>

<section class="page-container">
	{#if data.nights.length > 1}
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
		<h2>Noche {selectedNight}</h2>

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
</style>
