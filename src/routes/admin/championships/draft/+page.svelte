<script lang="ts">
	import { errorimage } from '$lib/actions/error.image';
	import AsyncForm from '$lib/components/forms/async-form.svelte';
	import BrandsToggle from '$lib/components/forms/inputs/brands-toggle.svelte';

	let { data } = $props();
	let summary: Record<string, number[]> = $derived.by(() => {
		return data.championships.reduce(
			(acc, championship) => {
				const brand = championship.brand?.toLowerCase() || 'other';
				if (!acc[brand]) acc[brand] = [];
				acc[brand] = [...acc[brand], championship.id];
				return acc;
			},
			{} as Record<string, number[]>
		);
	});
</script>

<div class="championship-brands-page">
	{#if Object.keys(summary).length > 0}
		<div class="brand-counts bottom">
			{#each Object.entries(summary) as [brand, ids]}
				<div class="w1 brand-count flex start acenter gap-small">
					<span class="uppercase">{brand}</span>
					<strong>{ids.length}</strong>
				</div>
			{/each}
		</div>
	{/if}

	<AsyncForm
		action="update"
		redirect="/admin/championships"
		classes="brands-form"
		showButtons={true}
	>
		{#if data.championships.length === 0}
			<section class="empty-panel">
				<i class="bi bi-trophy"></i>
				<h2>No hay campeonatos activos</h2>
				<p>Cuando data.championships incluya titulos activos, apareceran aqui.</p>
			</section>
		{:else}
			<section class="championship-grid">
				{#each data.championships as championship}
					<input type="hidden" name="championships[]" value={championship.id} />

					<article class="championship-card">
						<div class="championship-image">
							<img
								src={championship.image || '/unknown-championship.webp'}
								alt={championship.name}
								use:errorimage={'/unknown-championship.webp'}
							/>
						</div>

						<div class="championship-info">
							<h2 class="tcenter">{championship.name}</h2>
							<p>{championship.type || 'Campeonato'} / {championship.gender || 'Sin division'}</p>
							<BrandsToggle name={`ch[${championship.id}][brand]`} value={championship.brand} />
						</div>
					</article>
				{/each}
			</section>
		{/if}
	</AsyncForm>
</div>

<style>
	.championship-brands-page {
		max-width: 1240px;
		margin: 0 auto;
		padding: 0 20px 50px;
		color: #172033;
	}

	.brand-count,
	.championship-card,
	.empty-panel {
		border: 1px solid #e2e8f0;
		border-radius: 8px;
		background: #fff;
		box-shadow: 0 14px 38px rgba(15, 23, 42, 0.07);
	}

	:global(.brands-form .form-inner-content) {
		display: grid;
		gap: 22px;
	}

	.brand-counts {
		width: 100%;
		max-width: 100%;
		overflow: hidden;
		overflow-x: auto;
		position: sticky;
		margin-bottom: 10px;
		top: 0;
		left: 0;
		width: 100%;
		display: flex;
		flex-wrap: nowrap;
		gap: 5px;
		padding: 6px;
		background-color: #fff;
		border: 1px solid #e2e8f0;
		border-radius: 8px;
		z-index: 10;
	}

	.brand-count {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		border: 1px solid #e2e8f0;
		background: #fff;
		border-radius: 8px;
		gap: 12px;
		min-height: 70px;
		padding: 14px;
		color: inherit;
		text-align: left;
		cursor: pointer;
	}

	.championship-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(255px, 1fr));
		gap: 16px;
	}

	.championship-card {
		display: grid;
		grid-template-rows: 132px auto auto auto;
		gap: 14px;
		min-height: 340px;
		padding: 16px;
	}

	.championship-image {
		display: grid;
		place-items: center;
		padding: 12px;
		border-radius: 8px;
		background: #f8fafc;
	}

	.championship-image img {
		width: 100%;
		height: 108px;
		object-fit: contain;
	}

	.championship-info {
		min-width: 0;
	}

	.championship-info h2 {
		margin: 0 0 5px;
		font-size: 18px;
		line-height: 1.2;
		overflow-wrap: anywhere;
	}

	.championship-info p {
		margin: 0;
		color: #728096;
		font-size: 13px;
		font-weight: 700;
	}

	.empty-panel {
		display: grid;
		place-items: center;
		min-height: 260px;
		padding: 24px;
		text-align: center;
	}

	.empty-panel i {
		font-size: 46px;
		color: #728096;
	}

	.empty-panel h2 {
		margin: 12px 0 6px;
	}

	.empty-panel p {
		margin: 0;
		color: #728096;
	}

	@media (max-width: 980px) {
		.brand-counts {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (max-width: 680px) {
		.championship-brands-page {
			padding: 0 12px 40px;
		}

		.brand-counts,
		.championship-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
