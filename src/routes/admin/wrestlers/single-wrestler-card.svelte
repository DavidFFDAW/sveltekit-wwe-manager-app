<script lang="ts">
	import { errorimage } from '$lib/actions/error.image';
	import { WrestlerConstants } from '$lib/constants/wrestler.constants';
	import type { Wrestler } from '@prisma/client';

	let { wrestler }: { wrestler: Wrestler } = $props();
	const status = $derived(WrestlerConstants.statusDict[wrestler.status] ?? wrestler.status);
</script>

<article class="wrestler-card">
	<div class="portrait">
		<img
			src={wrestler.image_name || '/vacant.webp'}
			alt=""
			use:errorimage={'/vacant.webp'}
			width="96"
			height="96"
		/>
	</div>
	<div class="identity">
		<p
			class="brand"
			class:raw={wrestler.brand.toLowerCase() === 'raw'}
			class:smackdown={['sd', 'smackdown'].includes(wrestler.brand.toLowerCase())}
		>
			<span aria-hidden="true"></span>{wrestler.brand || 'Sin marca'}
		</p>
		<h2><a href="/admin/wrestlers/upsert/{wrestler.id}">{wrestler.name}</a></h2>
		<span
			class="status"
			class:active={wrestler.status === 'active'}
			class:injured={wrestler.status === 'injured'}>{status || 'Sin estado'}</span
		>
	</div>
	<div class="overall"><span>Media</span><strong>{wrestler.overall}</strong></div>
	<div class="actions">
		<a
			class="edit-link"
			href="/admin/wrestlers/upsert/{wrestler.id}"
			aria-label="Editar a {wrestler.name}"
			><i class="bi bi-pencil" aria-hidden="true"></i> Editar</a
		>
		<a
			class="reigns-link"
			href="/admin/wrestlers/{wrestler.id}/reigns"
			aria-label="Ver reinados de {wrestler.name}"
			>Ver reinados <i class="bi bi-arrow-right" aria-hidden="true"></i></a
		>
	</div>
</article>

<style>
	.wrestler-card {
		display: grid;
		grid-template-columns: minmax(0, 1fr) 56px;
		align-items: center;
		gap: 1rem;
		padding: 1rem;
		height: 100%;
		border: 1px solid var(--border, #e0e4e9);
		border-radius: 12px;
		background: var(--surface, #fff);
		color: var(--text, #252b36);
	}
	.wrestler-card:hover {
		border-color: var(--muted, #aab3c1);
	}
	.portrait {
		overflow: hidden;
		border-radius: 8px;
		grid-column: 1 / -1;
		height: 180px;
		background: linear-gradient(145deg, var(--surface2, #f3f4f6), var(--border, #e3e7ed));
	}
	.portrait img {
		width: 100%;
		height: 100%;
		object-fit: contain;
		object-position: center bottom;
	}
	.identity {
		min-width: 0;
	}
	.brand {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		margin: 0 0 0.35rem;
		font-size: 0.7rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.07em;
		overflow-wrap: anywhere;
	}
	.brand span {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: #939baa;
		flex-shrink: 0;
	}
	.brand.raw span {
		background: var(--raw);
	}
	.brand.smackdown span {
		background: var(--smackdown);
	}
	h2 {
		font-size: 1.15rem;
		line-height: 1.3;
		margin: 0 0 0.4rem;
		overflow-wrap: anywhere;
	}
	h2 a:hover {
		text-decoration: underline;
	}
	.status {
		display: inline-block;
		padding: 0.2rem 0.55rem;
		border-radius: 5px;
		background: var(--surface2, #f0f1f4);
		color: var(--muted, #5c6473);
		font-size: 0.75rem;
	}
	.status.active {
		background: #e2f3e9;
		color: #236442;
	}
	.status.injured {
		background: #fff0d7;
		color: #81540b;
	}
	.overall {
		text-align: center;
	}
	.overall span {
		display: block;
		font-size: 0.7rem;
		color: var(--muted, #646b78);
		margin-bottom: 0.2rem;
	}
	.overall strong {
		font-size: 1.6rem;
		font-variant-numeric: tabular-nums;
	}
	.actions {
		grid-column: 1 / -1;
		justify-content: space-between;
		border-top: 1px solid var(--border, #e8ebef);
		padding-top: 0.8rem;
		display: flex;
		align-items: center;
		gap: 1rem;
	}
	.actions a {
		display: inline-flex;
		justify-content: center;
		align-items: center;
		gap: 0.5rem;
		min-height: 40px;
		font-size: 0.85rem;
		white-space: nowrap;
	}
	.edit-link {
		padding: 0.55rem 0.9rem;
		border: 1px solid var(--border, #dce0e6);
		border-radius: 7px;
		font-weight: 600;
	}
	.edit-link:hover {
		background: var(--surface2, #f0f1f4);
	}
	.reigns-link {
		color: var(--muted, #525e70);
	}
	.reigns-link:hover {
		text-decoration: underline;
	}
	a:focus-visible {
		outline: 2px solid var(--blue);
		outline-offset: 4px;
		border-radius: 4px;
	}
</style>
