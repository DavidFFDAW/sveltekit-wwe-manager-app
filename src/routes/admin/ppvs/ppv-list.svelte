<script lang="ts">
	import { errorimage } from '$lib/actions/error.image';
	import type { PPV } from '@prisma/client';
	import PpvActions from './ppv-actions.svelte';

	let { ppvs }: { ppvs: PPV[] } = $props();
	const dateFormat = new Intl.DateTimeFormat('es-ES', {
		weekday: 'short',
		day: 'numeric',
		month: 'long',
		year: 'numeric',
		timeZone: 'UTC'
	});
</script>

<ul class="ppv-grid" aria-label="Eventos PPV">
	{#each ppvs as ppv (ppv.id)}
		<li>
			<article class="ppv-card">
				<a class="image-link" href="/admin/ppvs/update/{ppv.id}" aria-label="Editar {ppv.name}">
					<img src={ppv.image || '/noimage.jpg'} alt="" width="400" height="180" use:errorimage />
				</a>

				<div class="card-content">
					<div class="card-meta">
						<span class="status" class:active={ppv.active}>
							{ppv.active ? 'Activo' : 'Inactivo'}
						</span>
						{#if ppv.type === 'tbd'}
							<span class="pending">Por anunciar</span>
						{:else if ppv.abbreviation}
							<span class="abbreviation">{ppv.abbreviation}</span>
						{/if}
					</div>
					<h3><a href="/admin/ppvs/update/{ppv.id}">{ppv.name}</a></h3>
					<div class="event-date" class:undated={!ppv.game_date}>
						<i class="bi bi-calendar3" aria-hidden="true"></i>
						{#if ppv.game_date}
							<time datetime={ppv.game_date.toISOString()}>
								{dateFormat.format(ppv.game_date)}
							</time>
						{:else}
							<span>Fecha pendiente</span>
						{/if}
					</div>
					<div class="venue">
						<i class="bi bi-geo-alt" aria-hidden="true"></i>
						<div>
							<p>{ppv.city || 'Ciudad por confirmar'}</p>
							<small>{ppv.stadium || 'Sede por confirmar'}</small>
						</div>
					</div>
				</div>
				<footer>
					<PpvActions {ppv} />
				</footer>
			</article>
		</li>
	{/each}
</ul>

<style>
	.ppv-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(min(100%, 290px), 1fr));
		gap: 1.25rem;
		padding: 0;
		margin: 0;
		list-style: none;
	}
	.ppv-grid > li {
		min-width: 0;
	}
	.ppv-card {
		height: 100%;
		display: flex;
		flex-direction: column;
		background: var(--surface, #fff);
		color: var(--text, #252b36);
		border: 1px solid var(--border, #e0e4e9);
		border-radius: 12px;
	}
	.ppv-card:hover {
		border-color: var(--muted, #aab3c1);
	}
	.image-link {
		display: block;
		background: #17191f;
		border-radius: 11px 11px 0 0;
		overflow: hidden;
	}
	.image-link img {
		width: 100%;
		height: 180px;
		padding: 0.5rem;
		border-radius: 10px;
		object-fit: contain;
		background: #000;
	}
	.card-content {
		padding: 1.1rem;
		flex: 1;
	}
	.card-meta {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 0.75rem;
	}
	.status {
		display: inline-flex;
		padding: 0.25rem 0.55rem;
		background: var(--surface2, #edf0f4);
		color: var(--muted, #626d7e);
		border-radius: 5px;
		font-size: 0.7rem;
		font-weight: 600;
	}
	.status.active {
		background: #e2f3e9;
		color: #236442;
	}
	.abbreviation {
		font-size: 0.7rem;
		font-weight: 700;
		letter-spacing: 0.07em;
		color: var(--muted, #687384);
		overflow-wrap: anywhere;
	}
	.pending {
		font-size: 0.7rem;
		color: #805611;
		background: #fff3d9;
		border-radius: 5px;
		padding: 0.25rem 0.55rem;
	}
	h3 {
		font-size: 1.2rem;
		margin: 0 0 1rem;
		line-height: 1.3;
		overflow-wrap: anywhere;
	}
	h3 a:hover {
		text-decoration: underline;
	}
	.event-date {
		display: flex;
		align-items: center;
		gap: 0.65rem;
		padding: 0.75rem;
		border-radius: 7px;
		background: var(--surface2, #f3f5f8);
		font-size: 0.85rem;
		line-height: 1.4;
	}
	.event-date i {
		color: var(--muted, #687384);
	}
	.event-date.undated {
		background: #fff3d9;
		color: #805611;
	}
	.venue {
		display: flex;
		align-items: flex-start;
		gap: 0.65rem;
		margin: 1rem 0.1rem 0;
		color: var(--muted, #687384);
	}
	.venue i {
		margin-top: 0.1rem;
	}
	.venue p {
		font-size: 0.85rem;
		overflow-wrap: anywhere;
	}
	.venue small {
		display: block;
		margin-top: 0.3rem;
		font-size: 0.75rem;
		overflow-wrap: anywhere;
	}
	footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
		padding: 0.75rem 1.1rem;
		border-top: 1px solid var(--border, #e0e4e9);
	}
	a:focus-visible {
		outline: 2px solid var(--blue);
		outline-offset: 3px;
	}
</style>
