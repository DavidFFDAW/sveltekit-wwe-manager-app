<script lang="ts">
	import IaTextarea from '$lib/components/forms/inputs/ia-textarea.svelte';

	let text: string = '';
	let loading: boolean = false;
	export let value: string;

	const sendGemini = async () => {
		loading = true;
		try {
			const datas = new FormData();
			datas.append(
				'prompt',
				`${value}. Escribe la respuesta directamente en HTML, lista para pegar en una página web, sin etiquetas <html> ni <body> ni <h1> y sin <scripts> o <style>. Solo contenido.`
			);

			const response = await fetch('/api/blog/generate', {
				method: 'POST',
				body: datas
			});

			const data = await response.json();
			console.log(data);
			text = data.text.replace('```html', '').replace('```', '');
		} catch (e) {
			console.error(e);
		} finally {
			loading = false;
		}
	};
</script>

<form method="post" action="" on:submit|preventDefault={sendGemini}>
	<IaTextarea
		label="Contenido"
		name="content"
		placeholder="Contenido del post"
		bind:value={text}
		required
	/>
</form>
