<script lang="ts">
	import { Utils } from '$lib/utils/general.utils';
	import { Toast } from '$lib/utils/toast.helper';

	let context = $state('');
	let provider = $state('gpt-20');
	let { models, updateContent, updateBlockState } = $props();
	let estimatedTokens = $derived(Utils.getEstimatedTextTokens(context));

	const handleSubmitGenerate = async (event: Event) => {
		event.preventDefault();
		const form = event.target;
		if (!form || !(form instanceof HTMLFormElement)) return;

		const formData = new FormData(form);
		const provider = formData.get('provider') as string;
		const instructions = formData.get('prompt') as string;
		if (!instructions) return alert('Por favor, ingresa instrucciones para la IA.');

		try {
			const response = await fetch(`/api/blog/generate/model/${provider}`, {
				method: 'POST',
				body: formData
			});
			const data = await response.json();
			if (!response.ok) {
				return Toast.error(data.message || 'Error al generar contenido con IA');
			}
			console.log({ generatedContent: data });
			updateContent({
				title: data.title,
				content: data.text,
				exceptr: data.excerpt
			});
			updateBlockState(false);
		} catch (error: any) {
			console.error({ error });
			Toast.error(error.message || 'Error al generar contenido con IA');
		}
	};
</script>

<div class="w1 box blog-ia-generate-block flex column astart gap-5">
	<header class="blog-ia-generate-title title-block flex start acenter gap-smaller pointer">
		<i class="bi bi-robot"></i>
		<h2 class="box-title">Contenido con IA</h2>
	</header>

	<form class="w1 h1 flex column between astart gap" method="post" onsubmit={handleSubmitGenerate}>
		<div class="w1 flex start astart column gap-smaller">
			<p class="artificial-info">
				Aquí solo tendrás que elegir un modelo y escribir el contexto de qué ha pasado o sobre qué
				irá el post. <br /> La inteligencia artificial se encargará del resto.
			</p>

			<label class="label">
				<span class="label-text">Modelo de IA</span>
				<select name="provider" class="w1 select" bind:value={provider}>
					{#each models as model}
						<option value={model}>{model}</option>
					{/each}
				</select>
			</label>

			<label class="label">
				<div class="w1 flex between acenter">
					<span class="label-text">Contexto para la IA</span>
					<small>Tokens: {estimatedTokens}</small>
				</div>

				<textarea
					name="prompt"
					placeholder="Instrucciones para la IA"
					class="w1 textarea"
					bind:value={context}
					required
				></textarea>
			</label>
		</div>

		<div class="w1 flex end acenter gap-5 buttons-container-item">
			<button type="submit" class="btn icon cta icon-gap-5">
				<i class="bi bi-check-lg"></i>
				<span>Generar</span>
			</button>
		</div>
	</form>
</div>

<style>
	label.label {
		width: 100%;
		display: flex;
		position: relative;
		flex-direction: column;
		gap: 4px;
	}
	label.label span.label-text {
		font-size: 16px;
		font-weight: 600;
		text-transform: uppercase;
		color: #000;
	}
	label.label textarea,
	label.label select {
		width: 100%;
		outline: none;
		font-size: 14px;
		font-family: 'sourcesans', sans-serif;
		background-color: #fff;
		border: 1px solid #ddd;
		border-radius: 5px;
		padding: 10px;
	}

	textarea {
		min-height: 100px;
		resize: vertical;
	}
</style>
