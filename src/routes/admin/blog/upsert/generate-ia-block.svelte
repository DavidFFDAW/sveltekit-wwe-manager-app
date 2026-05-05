<script lang="ts">
	import { Utils } from '$lib/utils/general.utils';
	import { Toast } from '$lib/utils/toast.helper';

	let context = $state('');
	let generated = $state('');
	let provider = $state('groq');
	let { models, updateContent } = $props();
	let estimatedTokens = $derived(Utils.getEstimatedTextTokens(context));

	const handleResetGenerate = () => {
		context = '';
		generated = '';
	};

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
				generated = '';
				return Toast.error(data.message || 'Error al generar contenido con IA');
			}
			console.log({ generatedContent: data });
			updateContent({
				title: data.title,
				content: data.text,
				exceptr: data.excerpt
			});
			generated = data.text;
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
		<div>
			<p class="artificial-info">
				Por defecto esta inteligencia artificial va a recibir instrucciones para escribir un post
				para un blog de WWE sobre el tema concreto que le especifiques y lo devolverá en html sin
				utilizar las etiquetas <code>"body"</code>, <code>"html"</code> ni <code>"head"</code>. Solo
				el contenido. Tampoco incluirá el titular <code>"h1"</code> ni etiquetas
				<code>"script"</code>
				o
				<code>"style"</code>.
			</p>

			<div class="flex end">
				<small>Tokens: {estimatedTokens}</small>
			</div>

			<textarea
				name="prompt"
				placeholder="Instrucciones para la IA"
				class="w1 textarea"
				bind:value={context}
				required
			></textarea>

			<select name="provider" class="w1 select" bind:value={provider}>
				{#each models as model}
					<option value={model}>{model}</option>
				{/each}
			</select>
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
</style>
