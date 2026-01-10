<script lang="ts">
	import Dialog from '$lib/components/dialog/dialog.svelte';

	let search = $state<string>('');
	let tempSearch = $state<string>('');
	let opened = $state<boolean>(false);
	let currentTab = $state<string>('iframe');
	let { value = $bindable<string>('') } = $props();
	const toggleOpened = (forceStatus: boolean | null = null) => {
		if (forceStatus !== null) {
			opened = forceStatus;
			return;
		}
		opened = !opened;
	};
</script>

<button type="button" class="btn secondary icon" onclick={() => toggleOpened()}>
	<i class="bi bi-google"></i>
	<span>Google</span>
</button>

<Dialog bind:opened title="Buscar imagen en Google" size="large">
	<div class="google-image-search-dialog dialog-backdrop">
		<header class="google-image-search-dialog-header google-image-header-tabs-container">
			<nav class="google-image-tabs w1 flex acenter">
				<label class="google-image-tab relative w1">
					<input
						type="radio"
						class="app-radio"
						name="google-image-search-tab"
						value="iframe"
						bind:group={currentTab}
					/>
					<span class="">Iframe integrado</span>
				</label>
				<label class="google-image-tab relative w1">
					<input
						type="radio"
						class="app-radio"
						name="google-image-search-tab"
						value="request"
						bind:group={currentTab}
					/>
					<span class="">Busqueda por solicitud</span>
				</label>
			</nav>
		</header>

		<div class="google-image-search-dialog-content dialog-content">
			<header>
				<label class="label google-image-search-label flex acenter gap-05">
					<span>Busqueda:</span>
					<input type="search" class="input w1" bind:value={tempSearch} />
					<button type="button" class="btn primary" onclick={() => (search = tempSearch)}>
						Buscar
					</button>
				</label>
			</header>

			<section class="google-image-search-results-content">
				{#if currentTab === 'iframe'}
					<iframe
						width="600"
						height="600"
						title="Google Image Search Results Iframe"
						src={`https://www.google.com/search?q=${encodeURIComponent(search)}&igu=1&tbm=isch`}
						class="google-image-search-iframe w1 h1"
						allowfullscreen
					>
					</iframe>
				{:else if currentTab === 'request'}
					<div class="results"></div>
				{/if}
			</section>
		</div>
	</div>
</Dialog>

<style>
	.google-image-search-dialog.dialog-backdrop {
	}

	:global(.app-general-dialog-content),
	.google-image-search-dialog.dialog-backdrop,
	.google-image-search-results-content,
	.google-image-search-dialog-content.dialog-content {
		height: 100%;
	}
	.google-image-search-results-content {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		gap: 1rem;
	}
	iframe.google-image-search-iframe {
		height: 100%;
		min-height: 100%;
	}
</style>
