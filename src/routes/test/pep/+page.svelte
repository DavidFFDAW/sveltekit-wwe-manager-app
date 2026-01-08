<script lang="ts">
	let search = $state('');
	let selected = $state(null);
	// let result = $state<any>(null);
	let result = $state<any>({
		images: [
			'https://www.python.org/static/community_logos/python-logo.png',
			'https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg',
			'https://www.python.org/static/img/python-logo.png'
		]
	});

	const handleSearch = async (event: Event) => {
		event.preventDefault();
		const form = event.target as HTMLFormElement;
		const formData = new FormData(form);
		const query = formData.get('search') as string;
		const params = new URLSearchParams({ search: query });

		try {
			const resp = await fetch(`/test/pep?${params.toString()}`);
			const data = await resp.json();
			result = data;
			console.log('Search results:', { data });
		} catch (error) {
			console.error('Error fetching search results:', error);
		}
	};
</script>

<section class="page">
	<form action="" method="get" onsubmit={handleSearch}>
		<label for="search">Search PEPs:</label>
		<input type="search" name="search" placeholder="Search PEPs..." bind:value={search} required />
	</form>

	<div class="preview">
		<img
			width="75"
			src={selected ? selected : '/noimage.jpg'}
			alt="Selected preview"
			loading="lazy"
			draggable="false"
		/>
		<label class="w1 label form-label">
			<span class="form-label-text">Imagen</span>
			<input type="text" readonly value={selected ? selected : ''} />
		</label>
	</div>

	<div class="results-container">
		<div class="results">
			{#if result && result.images && result.images.length > 0}
				{#each result.images as image}
					<button
						class="btn unbutton clickable item"
						type="button"
						onclick={() => (selected = image)}
					>
						<img src={image} alt="{search} result" loading="lazy" draggable="false" />
					</button>
				{/each}
			{/if}
		</div>
	</div>
</section>

<style>
	.page {
		width: 100%;
		height: calc(100dvh - 30px);
		max-width: 600px;
		border: 1px solid #ccc;
		padding: 1rem;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.preview {
		display: flex;
		justify-content: flex-start;
		align-items: center;
		gap: 0.5rem;
	}
	.preview img {
		border: 1px solid #ccc;
		border-radius: 4px;
		overflow: hidden;
		object-fit: cover;
	}

	.results-container {
		flex: 1;
		overflow-y: auto;
		max-height: calc(100dvh - 200px);
		padding-right: 6px;
	}
	.results {
		margin-top: 1rem;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
		align-items: stretch;
		gap: 0.5rem;
	}

	.results .item {
		width: 100%;
		height: 100%;
		border: 1px solid #ccc;
		border-radius: 4px;
		overflow: hidden;
	}

	.results .item img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
</style>
