<script lang="ts">
	import { errorimage } from '$lib/actions/error.image';
	import ButtonCreate from '$lib/components/buttons/button-create.svelte';
	import PageWrapper from '$lib/components/page-wrapper/page-wrapper.svelte';

	let { data } = $props();
</script>

<PageWrapper page="championship-reigns">
	<header class="championship-reign-page-header">
		<h1 class="w1">Reinados</h1>

		<nav class="reign-actions" aria-label="Acciones de reinados">
			<a href="{data.path}/rankings">
				<i class="bi bi-trophy" aria-hidden="true"></i>
				<span>Rankings</span>
			</a>
			<a href="{data.path}/bydate">
				<i class="bi bi-calendar" aria-hidden="true"></i>
				<span>Por fecha</span>
			</a>
			<a href="{data.path}/defences/update">
				<i class="bi bi-shield" aria-hidden="true"></i>
				<span>Actualizar defensas</span>
			</a>
			<a href="{data.path}/upsert" class="create-action">
				<i class="bi bi-plus" aria-hidden="true"></i>
				<span>Nuevo reinado</span>
			</a>
		</nav>
		<!-- <HttpButton href="/api/reigns/update-days/current" icon="refresh">Actualizar días</HttpButton> -->
	</header>

	<ul class="w1 grid championships-list">
		{#each data.championships as championship}
			<li class="relative">
				<a
					href="{data.path}?championship={championship.id}"
					class="w1 card box chp-card flex column astart gap-5"
					class:inactive={!championship.active}
				>
					<img
						src={championship.image}
						alt={championship.name}
						width="80"
						height="80"
						use:errorimage={'/unknown-championship.webp'}
						class="championship-image"
					/>
					<h2>{championship.name}</h2>
					{#if !championship.active}
						<span class="badge badge-active">Desactivado</span>
					{/if}
				</a>
			</li>
		{/each}
	</ul>

	<ButtonCreate endpoint="/reigns/upsert" />
</PageWrapper>

<style>
	.reign-actions {
		display: grid;
		grid-template-columns: repeat(4, auto);
		width: fit-content;
		max-width: 100%;
		margin: 12px 0 18px;
		border: 1px solid #d9dde2;
		border-radius: 8px;
		background: #fff;
	}

	.reign-actions a {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 7px;
		min-height: 38px;
		padding: 9px 16px;
		border: none;
		border-radius: 0;
		background: transparent;
		color: #374151;
		font-size: 0.85rem;
		font-weight: 600;
		line-height: 1.25;
		text-decoration: none;
	}

	.reign-actions a + a {
		border-left: 1px solid #d9dde2;
	}
	.reign-actions a:first-child {
		border-radius: 7px 0 0 7px;
	}
	.reign-actions a:last-child {
		border-radius: 0 7px 7px 0;
	}

	.reign-actions a:hover {
		background: #f3f4f6;
	}

	.reign-actions a.create-action {
		background: #edf7f0;
		color: #28613b;
	}

	.reign-actions a.create-action:hover {
		background: #dcefe2;
	}

	.reign-actions a:focus-visible {
		outline: 2px solid #2375b9;
		outline-offset: -3px;
	}

	@media (max-width: 640px) {
		.reign-actions {
			width: 100%;
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
		.reign-actions a {
			padding: 10px 8px;
		}
		.reign-actions a:nth-child(3) {
			border-left: none;
			border-top: 1px solid #d9dde2;
			border-radius: 0 0 0 7px;
		}
		.reign-actions a:nth-child(4) {
			border-top: 1px solid #d9dde2;
			border-radius: 0 0 7px 0;
		}
	}

	:root {
		--background-color: #f9f9f9;
		--box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.grid.championships-list {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		place-items: stretch;
		gap: 12px;
	}

	.grid.championships-list a {
		width: 100%;
		height: 100%;
		min-height: 135px;
		max-height: 135px;
		display: flex;
		justify-content: space-around;
		flex-direction: column;
		align-items: center;
		gap: 15px;
		padding: 20px 15px;
		border-radius: 8px;
		background-color: #fff;
		border: 1px solid #ccc;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
		text-align: center;
	}

	.grid.championships-list a:hover {
		background-color: #e8f5fe;
		border-color: #00aaff;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
	}

	.grid.championships-list a img {
		width: 80px;
		height: 60px;
		max-width: 80px;
		max-height: 80px;
		object-fit: contain;
	}
	.grid.championships-list a.inactive img {
		opacity: 0.5;
		filter: grayscale(60%);
	}
	.grid.championships-list a h2 {
		font-size: 1rem;
		color: #333;
		text-transform: uppercase;
		font-family: 'rumble';
		letter-spacing: -1px;
	}

	.grid.championships-list a .badge {
		position: absolute;
		top: 10px;
		right: 10px;
	}

	.grid.championships-list a .badge.badge-active {
		display: inline-block;
		font-size: 0.75rem;
		padding: 2px 10px;
		border-radius: 50px;
		background-color: #333;
		color: #fff;
	}
</style>
