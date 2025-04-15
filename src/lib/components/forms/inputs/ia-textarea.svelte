<script lang="ts">
	import Icon from '$lib/components/icons/icon.svelte';
	import { Utils } from '$lib/utils/general.utils';
	import { onMount } from 'svelte';
	import type Quill from 'quill';
	import { Toast } from '$lib/utils/toast.helper';

	let quill: Quill;
	let prompt: string = '';
	let component: HTMLElement;
	let loading: boolean = false;

	export let name: string;
	export let label: string;
	export let value: string;
	export let placeholder: string = 'Escribe algo...';
	const randomId = Utils.getRandomID(name);

	onMount(async () => {
		const { default: Quill } = await import('quill');

		quill = new Quill(component, {
			theme: 'snow',
			placeholder: placeholder,
			modules: {
				toolbar: [
					[{ header: '1' }, { header: '2' }, { font: [] }],
					[{ size: [] }],
					['bold', 'italic', 'underline', 'strike', 'blockquote'],
					[{ list: 'ordered' }, { indent: '-1' }, { indent: '+1' }],
					['link', 'image', 'video'],
					['clean']
				],
				clipboard: {
					matchVisual: false
				}
			},
			formats: [
				'header',
				'font',
				'size',
				'bold',
				'italic',
				'underline',
				'strike',
				'blockquote',
				'list',
				'indent',
				'link',
				'image',
				'video'
			]
		});

		if (value) quill.root.innerHTML = value;
		quill.on('text-change', () => {
			if (!quill) return;
			value = quill.root.innerHTML;
		});
	});

	const getIaResponseText = async () => {
		if (!prompt) return;
		if (loading) return;

		const datas = new FormData();
		datas.append(
			'prompt',
			`${prompt}. Escribe la respuesta directamente en HTML, lista para pegar en una página web, sin etiquetas <html> ni <body> ni <h1> y sin <scripts> o <style>. Solo contenido.`
		);

		loading = true;
		quill.enable(false);
		try {
			const response = await fetch('/api/blog/generate', {
				method: 'POST',
				body: datas
			});
			const data = await response.json();
			const message = data.message || 'Error al obtener la respuesta de la IA.';
			if (!response.ok) return Toast.error(message);

			const text = data.text.replace('```html', '').replace('```', '');
			quill.root.innerHTML = text;
			value = text;
		} catch (error) {
			console.error(error);
		} finally {
			prompt = '';
			loading = false;
			quill.enable(true);
		}
	};

	const pressKey = (event: KeyboardEvent) => {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			getIaResponseText();
		}
	};
</script>

<div class="textarea-ia-container">
	<div class="form-item">
		<label
			class="label form-label {$$restProps.required ? 'required-label' : ''}"
			for={`${name}-${randomId}`}
		>
			{label}
			{#if $$restProps.required}
				<span class="required-label">*</span>
			{/if}
		</label>

		<div class="quill-editor-wrapper-container">
			<div bind:this={component} id={`${name}-${randomId}`}></div>
		</div>

		<input type="hidden" {name} bind:value required />
	</div>

	<div class="artificial-intelligence-container relative">
		{#if loading}
			<div class="loading-spinner absolute w1 h1 top left">
				<div class="spinner"></div>
			</div>
		{/if}

		<textarea
			bind:value={prompt}
			rows="1"
			cols="10"
			placeholder="Pídele algo a la IA..."
			on:keydown={pressKey}
		></textarea>
		<div class="buttons flex column">
			<button type="button" class="btn btn-submit" disabled={loading} on:click={getIaResponseText}>
				<Icon icon="send-fill" />
			</button>
			<button type="button" class="btn btn-reset" disabled={loading} on:click={() => (prompt = '')}>
				<Icon icon="trash" />
			</button>
		</div>
	</div>
</div>
