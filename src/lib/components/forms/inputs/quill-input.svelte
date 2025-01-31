<script lang="ts">
	import { Utils } from '$lib/utils/general.utils';
	import type Quill from 'quill';
	import { onMount } from 'svelte';

	let quill: Quill;
	let component: HTMLElement;
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
					[{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
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
				'bullet',
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
</script>

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

	<!-- <input type="hidden" {name} bind:value /> -->
</div>
