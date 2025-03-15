<script lang="ts">
	import AsyncForm from '$lib/components/forms/async-form.svelte';
	import FileDropper from '$lib/components/visual/file-dropper.svelte';
	import { Utils } from '$lib/utils/general.utils.js';
	import ImportTable from './import-table.svelte';
	import type { ImportationDatas } from './importation.models.js';
	import ReleaseTable from './release-table.svelte';
	import ScrapperCode from './scrapper-code.svelte';

	export let data;
	let tab = 'import';
	let uploadingWrestlers: ImportationDatas[] = [];
	let releasingWrestlers: { id: number; name: string; image_name: string | null }[] = [];
	$: onlyNames = [...new Set(data.wrestlers.map((wrestler) => wrestler.name.toLowerCase()))];

	const getFileContent = (fileContent: ImportationDatas[]) => {
		if (tab === 'import') {
			uploadingWrestlers = fileContent
				.filter((wrestler) => {
					const wrestlerName = wrestler.name.trim();
					return !onlyNames.includes(wrestlerName.toLowerCase())
						? !/ .*'\d{2,}/.test(wrestlerName)
						: false;
				})
				.sort((a, b) => a.name.localeCompare(b.name));
		}

		if (tab === 'release') {
			const fileContentNames = fileContent.map((wrestler) => wrestler.name.toLowerCase());
			releasingWrestlers = data.wrestlers
				.filter((wrestler) => {
					const wrestlerName = wrestler.name.trim();
					return (
						wrestler.status !== 'released' && !fileContentNames.includes(wrestlerName.toLowerCase())
					);
				})
				.sort((a, b) => a.name.localeCompare(b.name));
		}
	};

	const setUploadingContent = (content: ImportationDatas[]) => {
		getFileContent(content);
		console.log({ uploadingWrestlers, releasingWrestlers });

		setTimeout(() => {
			const button = document.querySelector('.import-button-container');
			if (button) button.scrollIntoView({ behavior: 'smooth' });
		}, 500);
	};

	const onDropImage = async (files: FileList) => {
		const jsonContent = await Utils.readFile(files[0], 'text');
		if (!jsonContent) return;

		setUploadingContent(JSON.parse(jsonContent));
	};

	const setTab = (tabName: string) => (event: Event) => {
		event.preventDefault();
		tab = tabName;
	};
</script>

<div class="w1 flex tabs">
	<button class="tab" on:click={setTab('import')} class:active={tab === 'import'}>
		Importar
	</button>
	<button class="tab" on:click={setTab('release')} class:active={tab === 'release'}>
		Despedir
	</button>
	<button class="tab" on:click={setTab('scrapper')} class:active={tab === 'scrapper'}>
		Código de scrapeo
	</button>
</div>
<section class="w1 h1 smackdown-hotel-integration flex total astart column gap-small down">
	<h1>Smackdown Hotel</h1>

	{#if tab === 'scrapper'}
		<ScrapperCode />
	{/if}

	{#if tab === 'import' || tab === 'release'}
		<div class="w1 importation-panel panel flex column gap-smaller astart">
			<div class="title">
				<h2>{tab === 'import' ? 'Importar' : 'Despedir'} luchadores</h2>
				<small>
					Para {tab === 'import' ? 'importar' : 'despedir'} luchadores del roster, simplemente selecciona
					el archivo JSON que descargaste y pulsa el botón de {tab === 'import'
						? 'importar'
						: 'despedir'}.
				</small>
			</div>

			<div class="w1 import-form import-form-space relative">
				<FileDropper fileAction={onDropImage} />
			</div>

			<AsyncForm
				method="post"
				action={tab === 'import' ? 'importWrestlers' : 'releaseWrestlers'}
				classes="down"
				showButtons={false}
			>
				<div class="importation-datas-real-datas real-datas-fill-fields">
					{#if uploadingWrestlers.length > 0 || releasingWrestlers.length > 0}
						<h3>Wrestlers a {tab === 'import' ? 'importar' : 'despedir'}</h3>
						{#if tab === 'import'}
							<small>
								El slug y las cuentas de twitter se autogenerarán al hacer la importación
							</small>
						{/if}

						<div class="import-real-panel down">
							{#if tab === 'import'}
								<ImportTable bind:wrestlers={uploadingWrestlers} />
							{/if}
							{#if tab === 'release'}
								<ReleaseTable bind:wrestlers={releasingWrestlers} />
							{/if}
						</div>
					{:else}
						<p>No hay luchadores para {tab === 'import' ? 'importar' : 'despedir'}</p>
					{/if}

					{#if uploadingWrestlers.length > 0 || releasingWrestlers.length > 0}
						<div class="w1 flex end acenter down import-button-container">
							<button class="btn cta" type="submit">
								{tab === 'import' ? 'Importar' : 'Despedir'}
							</button>
						</div>
					{/if}
				</div>
			</AsyncForm>
		</div>
	{/if}
</section>

<style>
	small {
		display: block;
		line-height: 1.2;
	}
	.tabs .tab {
		padding: 10px 20px;
		border: 1px solid #ccc;
		border-radius: 5px;
		cursor: pointer;
		background-color: #f9f9f9;
		transition: background-color 0.3s;
	}

	.tabs .tab.active {
		background-color: #333;
		color: #fff;
	}
</style>
