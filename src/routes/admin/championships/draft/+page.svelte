<script lang="ts">
	import { errorimage } from '$lib/actions/error.image';
	import AsyncForm from '$lib/components/forms/async-form.svelte';
	import { brands } from '$lib/constants/app';

	type BrandKey = 'raw' | 'smackdown' | 'awl' | 'other';
	type FilterKey = BrandKey | 'all';
	type ChampionshipBrandOption = {
		title: string;
		name: BrandKey;
		image: string;
	};
	type ChampionshipDraftItem = {
		id: number | string;
		name: string;
		image?: string | null;
		brand?: string | null;
		active?: boolean | number | null;
		short_title?: string | null;
		type?: string | null;
		gender?: string | null;
		order?: number | null;
	};

	let { data } = $props();
	const pageData = data as typeof data & {
		championships?: ChampionshipDraftItem[];
	};

	const brandOptions: ChampionshipBrandOption[] = [
		{ title: brands.raw.title, name: 'raw', image: brands.raw.image },
		{ title: brands.smackdown.title, name: 'smackdown', image: brands.smackdown.image },
		{ title: 'AWL / Evolution', name: 'awl', image: brands.awl.image },
		{ title: 'Otro', name: 'other', image: '/unknown-championship.webp' }
	];
	const filterOptions: Array<{ title: string; name: FilterKey }> = [
		{ title: 'Todos', name: 'all' },
		...brandOptions.map((brand) => ({ title: brand.title, name: brand.name }))
	];
	const validBrands = brandOptions.map((brand) => brand.name);

	const normalizeBrand = (brand?: string | null): BrandKey => {
		const normalized = brand?.toLowerCase();
		if (normalized === 'evolution') return 'awl';
		return validBrands.includes(normalized as BrandKey) ? (normalized as BrandKey) : 'other';
	};

	const sourceChampionships = (pageData.championships ?? []) as ChampionshipDraftItem[];
	const championships = sourceChampionships
		.filter((championship) => championship.active !== false && championship.active !== 0)
		.toSorted((a, b) => {
			const brandOrder = normalizeBrand(a.brand).localeCompare(normalizeBrand(b.brand));
			if (brandOrder !== 0) return brandOrder;
			return (a.order ?? 999) - (b.order ?? 999);
		});

	let assignments = $state<Record<string, BrandKey>>(
		Object.fromEntries(
			championships.map((championship) => [
				String(championship.id),
				normalizeBrand(championship.brand)
			])
		)
	);
	let currentFilter = $state<FilterKey>('all');

	let filteredChampionships = $derived.by(() => {
		if (currentFilter === 'all') return championships;
		return championships.filter(
			(championship) => assignments[String(championship.id)] === currentFilter
		);
	});
	let changedCount = $derived(
		championships.filter(
			(championship) => assignments[String(championship.id)] !== normalizeBrand(championship.brand)
		).length
	);

	const getBrandOption = (brand: BrandKey | string) =>
		brandOptions.find((option) => option.name === normalizeBrand(brand)) ?? brandOptions.at(-1);

	const getAssignedChampionships = (brand: BrandKey) =>
		championships.filter((championship) => assignments[String(championship.id)] === brand);

	const resetAssignments = () => {
		assignments = Object.fromEntries(
			championships.map((championship) => [
				String(championship.id),
				normalizeBrand(championship.brand)
			])
		);
		currentFilter = 'all';
	};
</script>

<div class="championship-brands-page">
	<AsyncForm
		action="updateBrands"
		redirect="/admin/championships"
		showButtons={false}
		classes="brands-form"
	>
		<section class="brand-counts">
			{#each brandOptions as brand}
				<button
					type="button"
					class="brand-count"
					class:active={currentFilter === brand.name}
					onclick={() => (currentFilter = brand.name)}
				>
					<img src={brand.image} alt={brand.title} />
					<span>{brand.title}</span>
					<strong>{getAssignedChampionships(brand.name).length}</strong>
				</button>
			{/each}
		</section>

		<section class="toolbar">
			<div class="filters" role="radiogroup" aria-label="Filtrar por marca">
				{#each filterOptions as filter}
					<label class="filter-item" class:active={currentFilter === filter.name}>
						<input
							type="radio"
							name="brand_filter"
							value={filter.name}
							bind:group={currentFilter}
						/>
						<span>{filter.title}</span>
					</label>
				{/each}
			</div>
		</section>

		{#if championships.length === 0}
			<section class="empty-panel">
				<i class="bi bi-trophy"></i>
				<h2>No hay campeonatos activos</h2>
				<p>Cuando data.championships incluya titulos activos, apareceran aqui.</p>
			</section>
		{:else}
			<section class="championship-grid">
				{#each filteredChampionships as championship}
					{@const assignedBrand = getBrandOption(assignments[String(championship.id)])}
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
						</div>

						<label class="brand-field">
							<span>Marca</span>
							<select
								name="ch[{championship.id}][brand]"
								bind:value={assignments[String(championship.id)]}
							>
								{#each brandOptions as brand}
									<option value={brand.name}>{brand.title}</option>
								{/each}
							</select>
						</label>

						<div class="current-brand">
							<img src={assignedBrand?.image} alt={assignedBrand?.title} />
							<span>{assignedBrand?.title}</span>
						</div>
					</article>
				{/each}
			</section>
		{/if}

		<footer class="form-actions">
			<div>
				<strong>{changedCount}</strong>
				<span>cambios pendientes</span>
			</div>

			<div class="action-buttons">
				<button type="button" class="btn secondary" onclick={resetAssignments}>
					<i class="bi bi-arrow-counterclockwise"></i>
					<span>Restaurar</span>
				</button>
				<button type="submit" class="btn cta" disabled={championships.length === 0}>
					<i class="bi bi-save"></i>
					<span>Guardar marcas</span>
				</button>
			</div>
		</footer>
	</AsyncForm>
</div>

<style>
	.championship-brands-page {
		max-width: 1240px;
		margin: 0 auto;
		padding: 0 20px 50px;
		color: #172033;
	}

	.toolbar,
	.form-actions {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 20px;
	}

	.summary-badge,
	.brand-count,
	.toolbar,
	.championship-card,
	.empty-panel,
	.form-actions {
		border: 1px solid #e2e8f0;
		border-radius: 8px;
		background: #fff;
		box-shadow: 0 14px 38px rgba(15, 23, 42, 0.07);
	}

	.summary-badge {
		min-width: 160px;
		padding: 16px;
		text-align: right;
	}

	.summary-badge strong {
		display: block;
		font-size: 28px;
	}

	.summary-badge span,
	.form-actions span {
		color: #728096;
		font-size: 13px;
		font-weight: 800;
	}

	:global(.brands-form .form-inner-content) {
		display: grid;
		gap: 22px;
	}

	.brand-counts {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 14px;
	}

	.brand-count {
		display: grid;
		grid-template-columns: 38px minmax(0, 1fr) auto;
		align-items: center;
		gap: 12px;
		min-height: 70px;
		padding: 14px;
		color: inherit;
		text-align: left;
		cursor: pointer;
	}

	.brand-count.active {
		border-color: #111827;
		box-shadow: 0 0 0 4px rgba(17, 24, 39, 0.08);
	}

	.brand-count img,
	.current-brand img {
		width: 38px;
		height: 38px;
		object-fit: contain;
	}

	.brand-count span {
		font-weight: 900;
		overflow-wrap: anywhere;
	}

	.brand-count strong {
		font-size: 24px;
	}

	.toolbar,
	.form-actions {
		padding: 18px;
		align-items: center;
	}

	.filters,
	.action-buttons {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
	}

	.filter-item {
		position: relative;
		display: inline-flex;
		align-items: center;
		min-height: 42px;
		padding: 8px 12px;
		border: 2px solid #e2e8f0;
		border-radius: 8px;
		background: #f8fafc;
		cursor: pointer;
	}

	.filter-item input {
		position: absolute;
		opacity: 0;
		pointer-events: none;
	}

	.filter-item span {
		font-size: 13px;
		font-weight: 900;
	}

	.filter-item.active {
		border-color: #2563eb;
		background: #eff6ff;
		color: #1d4ed8;
	}

	select {
		width: 100%;
		border: 1px solid #e2e8f0;
		border-radius: 8px;
		background: #fff;
		padding: 11px 12px;
		color: #172033;
		font: inherit;
	}

	select:focus {
		outline: none;
		border-color: #2563eb;
		box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.12);
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

	.brand-field {
		display: grid;
		gap: 8px;
	}

	.brand-field span {
		font-size: 13px;
		font-weight: 900;
	}

	.current-brand {
		display: flex;
		align-items: center;
		gap: 9px;
		min-height: 46px;
		padding: 8px 10px;
		border-radius: 8px;
		background: #f8fafc;
		color: #475569;
		font-size: 13px;
		font-weight: 900;
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

	.form-actions strong {
		display: block;
		font-size: 24px;
	}

	@media (max-width: 980px) {
		.brand-counts {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		.toolbar,
		.form-actions {
			align-items: flex-start;
			flex-direction: column;
		}
	}

	@media (max-width: 680px) {
		.championship-brands-page {
			padding: 0 12px 40px;
		}

		.summary-badge,
		.action-buttons,
		.action-buttons .btn {
			width: 100%;
		}

		.summary-badge {
			text-align: left;
		}

		.brand-counts,
		.championship-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
