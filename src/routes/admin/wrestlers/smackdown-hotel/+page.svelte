<script lang="ts">
	import { droppableImages } from '$lib/actions/droppable.images';
	import AsyncForm from '$lib/components/forms/async-form.svelte';
	import Icon from '$lib/components/icons/icon.svelte';
	import { Utils } from '$lib/utils/general.utils.js';
	import ImportTable from './import-table.svelte';
	import type { ImportationDatas } from './importation.models.js';

	export let data;
	let hasFile: boolean = false;
	let uploadingWrestlers: ImportationDatas[] = [];
	$: onlyNames = [...new Set(data.wrestlers.map((wrestler) => wrestler.name.toLowerCase()))];

	const copy = () => {
		const code = document.querySelector('code');
		if (!code || !code.textContent) return;
		navigator.clipboard.writeText(code.textContent);
	};

	const setUploadingContent = (content: ImportationDatas[]) => {
		uploadingWrestlers = content
			.filter((wrestler) => {
				const wrestlerName = wrestler.name.trim();
				if (!onlyNames.includes(wrestlerName.toLowerCase())) {
					return !wrestlerName.includes("'");
				}
			})
			.sort((a, b) => a.name.localeCompare(b.name));

		setTimeout(() => {
			const button = document.querySelector('.import-button-container');
			if (button) button.scrollIntoView({ behavior: 'smooth' });
		}, 500);
	};

	const onDropImage = async (event: DragEvent) => {
		const files = event.dataTransfer?.files;
		if (!files || files.length === 0) return;
		hasFile = files.length > 0;

		const jsonContent = await Utils.readFile(files[0], 'text');
		if (!jsonContent) return;

		setUploadingContent(JSON.parse(jsonContent));
	};

	const onFileChange = async (event: Event) => {
		event.preventDefault();
		const target = event.target as HTMLInputElement;
		if (!target.files) return;
		const file = target.files[0];
		if (!file) return;
		hasFile = target.files.length > 0;

		const jsonContent = await Utils.readFile(file, 'text');
		if (!jsonContent) return;

		setUploadingContent(JSON.parse(jsonContent));
	};
</script>

<section class="w1 h1 smackdown-hotel-integration flex total column gap">
	<div class="title">
		<h1>Smackdown Hotel</h1>
		<small>
			En esta página se proporciona el script que sirve para extraer los datos más importantes de
			los luchadores registrador en la página de Smackdown Hotel. Este script descarga un JSON con
			los datos. También se podrá importar dicho JSON para importar las nuevas adiciones al roster.
		</small>
	</div>

	<div class="w1 code-preview-copy down">
		<code>
			{@html `
	const rosterItems = [...(document.querySelectorAll('.roster_section .roster'))]; </code>
	const parsed = rosterItems.map((item) => {
		const overall = item.querySelector('.roster-overall');
		const name = item.querySelector('.roster_name');
		const label = item.querySelector('.roster_label');
		const image = item.querySelector('img');

		return { 
			overall: overall ? Number(overall.textContent) : null,
			name: name ? name.textContent : null,
			label: label ? label.textContent : null,
			image: image ? image.src : null
		};
	}).filter((value, index, self) => self.findIndex((t) => t.name === value.name) === index);

	const link = document.createElement('a');
	link.href = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(parsed, null, 2));
	link.download = 'the-smackdown-hotel-roster-${Date.now()}.json';
	link.click();
	link.remove();
	`}
		</code>
		<button class="btn copy" type="button" on:click={copy}>Copy</button>
		<small>
			Para usar este script, simplemente copia el código y pégalo en la consola de tu navegador
			mientras estás en la página de Smackdown Hotel.
		</small>
	</div>

	<div class="w1 importation-panel panel">
		<div class="title">
			<h2>Importar roster</h2>
			<small>
				Para importar el roster, simplemente selecciona el archivo JSON que descargaste y pulsa el
				botón para importar.
			</small>
		</div>

		<div class="import-form import-form-space relative">
			<input
				type="file"
				accept=".json"
				class="app-file"
				on:change={onFileChange}
				use:droppableImages={onDropImage}
			/>
			{#if hasFile}
				<Icon icon="check" classes="check" />
			{/if}
		</div>

		<AsyncForm method="post" action="importWrestlers" classes="down" showButtons={false}>
			<div class="importation-datas-real-datas real-datas-fill-fields">
				{#if uploadingWrestlers.length > 0}
					<h3>Wrestlers a importar</h3>
					<small>El slug y las cuentas de twitter se autogenerarán al hacer la importación</small>

					<div class="import-real-panel down">
						<ImportTable bind:wrestlers={uploadingWrestlers} />
					</div>
				{/if}

				{#if uploadingWrestlers.length > 0}
					<div class="w1 flex end acenter down import-button-container">
						<button class="btn cta" type="submit">Importar</button>
					</div>
				{/if}
			</div>
		</AsyncForm>
	</div>
</section>

<style>
	code {
		width: 100%;
		background-color: #fff;
		padding: 10px;
		display: block;
		border-radius: 5px;
		box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
		white-space: pre-wrap;
		overflow: hidden;
	}
	small {
		display: block;
		line-height: 1.2;
	}

	.code-preview-copy {
		position: relative;
	}

	.import-form.import-form-space {
		width: 100%;
		min-height: 250px;
		border: 2px dashed #ccc;
		border-radius: 5px;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.btn.copy {
		position: absolute;
		top: 10px;
		right: 10px;
	}
</style>
