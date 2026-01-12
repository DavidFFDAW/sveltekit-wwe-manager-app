<script lang="ts">
	import { fade } from 'svelte/transition';
	let opened = $state<boolean>(false);
	let originalImages = $state<any[]>([
		'https://image.api.playstation.com/vulcan/ap/rnd/202406/0500/8f15268257b878597757fcc5f2c9545840867bc71fc863b1.png',
		'https://image.api.playstation.com/vulcan/ap/rnd/202406/0500/8f15268257b878597757fcc5f2c9545840867bc71fc863b1.png'
	]);
	let search = $state<string>('');
	let currentTab = $state<string>('gallery');
	let currentGoogleTab = $state<string>('iframe');
	let hasGallery = $derived(
		['gallery', 'imgur'].includes(currentTab) ||
			(currentTab === 'google' && currentGoogleTab !== 'iframe')
	);
	let { value = $bindable<string>('') } = $props();
	let files = $state<FileList | null>(null);
	let preview = $derived.by(() => {
		if (!files || files.length === 0) return '';
		const file = files[0];
		const previewUrl = URL.createObjectURL(file);
		return previewUrl;
	});

	const togglePopup = () => (opened = !opened);

	const sendImage = async () => {
		if (!files || files.length === 0) return;

		const formData = new FormData();
		formData.append('image', files[0]);
		formData.append('type', 'file');
		formData.append('provider', currentTab);

		try {
			const response = await fetch('/api/images/upload', {
				method: 'PUT',
				body: formData
			});

			if (!response.ok) {
				throw new Error('Error al subir la imagen');
			}

			const data = await response.json();
			if (data && data.imageUrl) {
				value = data.imageUrl;
				originalImages = [data.imageUrl, ...originalImages];
				files = null;
			}
		} catch (error) {
			console.error('Error al subir la imagen:', error);
		}
	};

	$inspect({
		files,
		preview,
		hasGallery,
		currentTab,
		currentGoogleTab
	});
</script>

<button type="button" class="btn icon secondary" onclick={togglePopup}>
	<i class="bi bi-images"></i>
	<i class="bi bi-google"></i>
	<span>Imágenes</span>
</button>

<div class="popup-full-container full-gallery-popup" class:opened>
	<div role="presentation" class="popup-backdrop" onclick={togglePopup}></div>
	<div class="popup popup-container full-gallery-popup-container">
		<header class="popup-header">
			<div class="popup-header-container">
				<h2 class="dreadnotus uppercase">Imagenes</h2>
				<button
					type="button"
					class="btn icon close"
					onclick={togglePopup}
					aria-label="Cerrar galería"
				>
					<i class="bi bi-x-lg"></i>
				</button>
			</div>
			<nav class="popup-full-gallery-tabs">
				<button
					type="button"
					class="relative full-gallery-tab gallery"
					class:active={currentTab === 'gallery'}
				>
					<label>
						<input
							type="radio"
							class="app-radio"
							name="full-gallery-tab"
							value="gallery"
							bind:group={currentTab}
						/>
						<span>Galería</span>
					</label>
				</button>
				<button
					type="button"
					class="relative full-gallery-tab imgur"
					class:active={currentTab === 'imgur'}
				>
					<label>
						<input
							type="radio"
							class="app-radio"
							name="full-gallery-tab"
							value="imgur"
							bind:group={currentTab}
						/>
						<span>Imgur</span>
					</label>
				</button>
				<button
					type="button"
					class="relative full-gallery-tab google"
					class:active={currentTab === 'google'}
				>
					<label>
						<input
							type="radio"
							class="app-radio"
							name="full-gallery-tab"
							value="google"
							bind:group={currentTab}
						/>
						<span>Google</span>
					</label>
				</button>
			</nav>

			{#if currentTab == 'google'}
				<nav class="popup-full-gallery-tabs">
					<button
						type="button"
						class="relative full-gallery-tab iframe"
						class:active={currentGoogleTab === 'iframe'}
					>
						<label>
							<input
								type="radio"
								class="app-radio"
								name="full-gallery-google-tab"
								value="iframe"
								bind:group={currentGoogleTab}
							/>
							<span>Iframe</span>
						</label>
					</button>
					<button
						type="button"
						class="relative full-gallery-tab api"
						class:active={currentGoogleTab === 'api'}
					>
						<label>
							<input
								type="radio"
								class="app-radio"
								name="full-gallery-google-tab"
								value="api"
								bind:group={currentGoogleTab}
							/>
							<span>API</span>
						</label>
					</button>
				</nav>
			{/if}
		</header>

		<div
			class="popup-body full-gallery-popup-body-container tab-{currentTab} tab-google-{currentGoogleTab}"
		>
			<header class="searcher">
				<input type="text" class="app-text-input" placeholder="Buscar imagen..." />
			</header>
			{#if hasGallery}
				<div class="full-gallery-popup-list-container" transition:fade>
					<div class="full-gallery-grid">
						{#each originalImages as image}
							<div class="gallery-item relative">
								<img
									src={image}
									alt="Imagen de la galería"
									draggable="false"
									role="presentation"
									data-url={image}
									onclick={() => {
										value = image;
										togglePopup();
									}}
								/>
								<span class="img-name">{image}</span>
							</div>
						{/each}
					</div>
				</div>

				{#if currentTab !== 'google'}
					<aside class="full-gallery-upload-container" transition:fade>
						<label
							class="relative fg-upload-input-label-preview"
							style="--bg-image: url({preview});"
						>
							<input type="file" class="app-file-input app-radio" accept="image/*" bind:files />
						</label>
						{#if files && files.length > 0}
							<button type="button" class="btn send" onclick={sendImage}>Subir imagen</button>
						{/if}
					</aside>
				{/if}
			{:else if currentTab === 'google' && currentGoogleTab === 'iframe'}
				<div class="full-gallery-google-iframe-container" transition:fade>
					<iframe
						src="https://www.google.com/search?q={encodeURIComponent(search)}&igu=1&tbm=isch"
						width="100%"
						height="100%"
						style="border:none;"
						title="Resultados de Google Imágenes"
					>
					</iframe>
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	:root {
		--full-gallery-aside-width: 250px;
	}
	.full-gallery-popup {
		display: none;
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 1000;
	}

	.full-gallery-popup.opened {
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.full-gallery-popup .popup-backdrop {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.5);
	}

	.full-gallery-popup .popup-container {
		position: relative;
		background: #fff;
		width: 90%;
		height: calc(100dvh - 140px);
		border-radius: 8px;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
		overflow: hidden;
	}

	.full-gallery-popup .popup-container header .popup-header-container {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		background-color: #333;
		color: #fff;
		padding: 10px 12px;
		gap: 12px;
	}
	.full-gallery-popup .popup-container header .btn.close {
		background: none;
		border: none;
		color: #fff;
		font-size: 1.5rem;
		padding: 6px;
		cursor: pointer;
	}
	.full-gallery-popup .popup-container header .popup-full-gallery-tabs {
		min-height: 60px;
		padding: 8px 12px;
		display: flex;
		background-color: #eee;
		border-bottom: 1px solid #ccc;
		gap: 6px;
	}
	.full-gallery-popup .popup-container header .popup-full-gallery-tabs .full-gallery-tab {
		min-width: 180px;
		background-color: #fff;
		color: #646d81;
		border: 1px solid #646d81;
		padding: 10px;
		opacity: 0.7;
		filter: blur(1px);
		text-transform: uppercase;
		font-weight: bold;
		font-family: 'opensans', sans-serif;
		cursor: pointer;
	}
	.full-gallery-popup .popup-container header .popup-full-gallery-tabs .full-gallery-tab.active {
		background-color: #646d81;
		color: #fff;
		border-radius: 4px;
		opacity: 1;
		filter: blur(0);
	}

	.popup-body.full-gallery-popup-body-container {
		position: relative;
	}
	.popup-body.full-gallery-popup-body-container .full-gallery-popup-list-container {
		height: 100%;
		margin-right: var(--full-gallery-aside-width);
		padding: 15px;
		max-height: calc(100dvh - 300px);
		min-height: calc(100dvh - 300px);
		overflow-y: auto;
	}
	.popup-body.full-gallery-popup-body-container .full-gallery-grid {
		display: grid;
		height: 100%;
		grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
		gap: 15px 6px;
	}
	.popup-body.full-gallery-popup-body-container .full-gallery-grid .gallery-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		background-color: #f9f9f9;
		border: 1px solid #ddd;
		border-radius: 8px;
		overflow: hidden;
		cursor: pointer;
		gap: 8px;
	}
	.popup-body.full-gallery-popup-body-container .full-gallery-grid .gallery-item .img-name {
		color: #333;
		font-size: 0.75rem;
		max-width: 100%;
		text-align: center;
		padding: 2px 5px;
		width: 100%;
		white-space: nowrap;
		overflow: hidden;
		overflow-x: auto;
	}

	.full-gallery-upload-container {
		width: var(--full-gallery-aside-width);
		height: 100%;
		position: absolute;
		right: 0;
		top: 0;
		background-color: #f0f0f0;
		border-left: 2px solid #ccc;
		padding: 10px 6px;
	}

	.fg-upload-input-label-preview {
		position: relative;
		display: block;
		width: 100%;
		height: 150px;
		cursor: pointer;
		background-color: #fff;
		border: 2px dashed #ccc;
		background-image: var(--bg-image);
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
		border-radius: 8px;
	}
	.fg-upload-input-label-preview input[type='file'].app-file-input {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		opacity: 0;
		cursor: pointer;
	}

	.popup-body.full-gallery-popup-body-container header.searcher {
		width: 100%;
		max-width: calc(100% - var(--full-gallery-aside-width));
		padding: 10px 15px 0 15px;
	}
	.popup-body.full-gallery-popup-body-container.tab-google header.searcher {
		max-width: 100%;
	}
	.popup-body.full-gallery-popup-body-container.tab-google .full-gallery-google-iframe-container {
		width: 100%;
		padding: 0 15px;
	}
	.popup-body.full-gallery-popup-body-container.tab-google iframe {
		border: 1px solid #ccc;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		outline: none;
		border-radius: 4px;
		height: calc(100dvh - 360px);
	}

	@media only screen and (max-width: 768px) {
		.full-gallery-upload-container {
			display: none;
		}
		.popup-body.full-gallery-popup-body-container .full-gallery-popup-list-container {
			margin-right: 0;
		}
		.popup-body.full-gallery-popup-body-container header.searcher {
			max-width: 100%;
		}
		.full-gallery-popup .popup-container header .popup-full-gallery-tabs {
			max-width: 100%;
			overflow-x: auto;
		}
	}
</style>
