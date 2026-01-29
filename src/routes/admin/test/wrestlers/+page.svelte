<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const setError = (event: Event) => {
		const img = event.target as HTMLImageElement;
		if (!img) return;
		img.onerror = null; // Prevent infinite loop if the fallback image also fails
		img.setAttribute('src', '/vacant.webp');
	};

	let brands = [...new Set(data.wrestlers.map((wrestler) => wrestler.brand))];
</script>

<section>
	<pre>{brands.join(', ')}</pre>

	<ul>
		{#each data.wrestlers as wrestler}
			<li class="brand-{wrestler.brand.toLowerCase()} status-{wrestler.status}">
				<div class="wrestler-header">
					<span class="wrestler-name">{wrestler.name}</span>
					<img
						src="/brands/{wrestler.brand.toLowerCase()}.webp"
						alt={wrestler.brand}
						width="24"
						height="24"
						class="wrestler-brand-logo"
						draggable="false"
					/>
				</div>

				<img
					src={wrestler.image_name}
					alt={wrestler.name}
					width="80"
					height="80"
					class="wrestler-image"
					onerror={setError}
					draggable="false"
				/>
			</li>
		{/each}
	</ul>
</section>

<style>
	:root {
		--item-width: 150px;
		--color: var(--raw);
	}

	ul {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(var(--item-width), 1fr));
		gap: 10px;
	}

	ul li {
		position: relative;
		min-height: var(--item-width);
		background-color: #fff;
		border: 1px solid #ddd;
		border-radius: 8px;
		padding: 10px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		overflow: hidden;
	}
	ul li.brand-raw {
		--color: var(--raw);
	}
	ul li.brand-sd,
	ul li.brand-smackdown {
		--color: var(--sd);
	}
	ul li.brand-awl {
		--color: var(--awl);
	}
	ul li.status-legend {
		--color: var(--legend);
	}
	ul li::after {
		content: '';
		position: absolute;
		top: 0;
		right: 0;
		width: 0;
		height: 0;
		border-top: calc(var(--item-width) / 2) solid transparent;
		border-left: calc(var(--item-width) / 2) solid transparent;
		border-right: calc(var(--item-width) / 2) solid var(--color);
		border-bottom: calc(var(--item-width) / 2) solid var(--color);
		opacity: 0.2;
	}

	ul li img.wrestler-image {
		width: 100%;
		display: block;
		max-width: 70%;
		position: absolute;
		bottom: 0;
		right: 0;
		z-index: 1;
		object-position: right;
		object-fit: cover;
	}
	ul li .wrestler-header {
		position: relative;
		width: 100%;
		display: flex;
		align-items: flex-start;
		flex-direction: column;
		gap: 2px;
		z-index: 2;
	}
	ul li .wrestler-header .wrestler-name {
		display: block;
		position: relative;
		font-weight: bold;
		font-size: 0.9rem;
		text-align: left;
		color: #333;
		text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.8);
	}
	ul li .wrestler-header .wrestler-name::after {
		content: '';
		position: absolute;
		bottom: 0px;
		left: 0;
		width: 50%;
		height: 2px;
		background-color: var(--color);
		opacity: 0.6;
	}

	ul li .wrestler-header .wrestler-brand-logo {
		width: 20px;
		height: 20px;
		object-fit: contain;
	}
</style>
