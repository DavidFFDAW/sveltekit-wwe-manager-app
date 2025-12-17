<script lang="ts">
	import { HttpService } from '$lib/services/http.service';
	import { Toast } from '$lib/utils/toast.helper';

	let prompt = $state('');
	let loading = $state(false);
	let { content = $bindable(''), onaftersubmit }: { content: string; onaftersubmit?: () => void } =
		$props();

	const handleSubmit = async (ev: Event) => {
		ev.preventDefault();
		if (!prompt) return;
		if (loading) return;

		const datas = new FormData();
		datas.set(
			'prompt',
			`Escribe el contenido para el post de un blog de wwe. El tema será: ${prompt}. Escribe la respuesta directamente en HTML, lista para pegar en una página web, sin etiquetas <html> ni <body> ni <h1> y sin <scripts> o <style>. Solo contenido.`
		);

		loading = true;
		try {
			const response = await HttpService.post('/api/blog/generate', {
				body: datas
			});
			const message = response.response?.message || 'Error al obtener la respuesta de la IA.';
			if (!response.ok) return Toast.error(message);
			content = response.response.text.replace('```html', '').replace('```', '');
		} catch (error: any) {
			console.error(error);
		} finally {
			prompt = '';
			loading = false;
			if (onaftersubmit) onaftersubmit();
		}
	};
</script>

<form method="post" class="app-form" onsubmit={handleSubmit}>
	<div class="artificial-intelligence-container relative flex column">
		<p class="artificial-info">
			Por defecto esta inteligencia artificial va a recibir instrucciones para escribir un post para
			un blog de WWE sobre el tema concreto que le especifiques y lo devolverá en html sin utilizar
			las etiquetas <code>"body"</code>, <code>"html"</code> ni <code>"head"</code>. Solo el
			contenido. Tampoco incluirá el titular <code>"h1"</code> ni etiquetas
			<code>"script"</code>
			o
			<code>"style"</code>.
		</p>
		{#if loading}
			<div class="loading-spinner absolute w1 h1 top left">
				<div class="spinner"></div>
			</div>
		{/if}

		<div class="w1 flex column gap-5">
			<textarea
				bind:value={prompt}
				rows="1"
				cols="10"
				placeholder="Escribe el tema concreto para generar una entrada para el blog..."
			></textarea>

			<div class="w1 buttons flex between acenter gap-5">
				<button
					type="button"
					class="btn btn-reset"
					disabled={loading}
					onclick={() => (prompt = '')}
					aria-label="Limpiar texto"
				>
					<i class="bi bi-trash"></i>
				</button>

				<button
					type="submit"
					class="btn btn-submit"
					disabled={loading}
					aria-label="Generar contenido del blog"
				>
					<i class="bi bi-send-fill"></i>
				</button>
			</div>
		</div>
	</div>

	<input type="hidden" name="prompt" bind:value={prompt} />
</form>
