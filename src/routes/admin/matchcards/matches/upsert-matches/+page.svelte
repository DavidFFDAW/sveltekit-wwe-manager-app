<script lang="ts">
	import AsyncForm from '$lib/components/forms/async-form.svelte';

	let { data } = $props();
	let _inner = $state(data.match_card);
	let matches = $state(data.match_card.matches);
	let orders = $derived(matches.map((m) => m.order));

	const handleToggleDelete = (match: any) => () => {
		console.log(match);
		if (match.type === 'create') {
			matches = matches.filter((m) => m !== match);
			return;
		}
		match.deleted = !match.deleted;
	};

	const handleAddMatch = () => {
		matches = [
			...matches,
			{
				id: Date.now(),
				order: orders.length > 0 ? Math.max(...orders) + 1 : 1,
				stipulation: '',
				championship: '',
				participants: '',
				night: 1,
				type: 'create'
			}
		];
	};
</script>

<header class="sticky-page-header flex between">
	<div class="flex gap-small">
		<img
			width="80"
			draggable="false"
			src={_inner.matchCard.ppv_image}
			alt={_inner.matchCard.ppv_name}
			class="ppv-image"
		/>
		<h1 class="page-title">{_inner.matchCard.ppv_name}</h1>
	</div>

	<button type="button" class="btn rounded cta" onclick={handleAddMatch}>
		<i class="bi bi-plus"></i>
		<span class="label">Añadir combate</span>
	</button>
</header>

<div class="matchcard-page">
	<datalist id="wrestlers">
		{#each _inner.wrestlers as wrestler}
			<option value={wrestler.name}>{wrestler.name}</option>
		{/each}
	</datalist>

	<div class="page-container">
		<AsyncForm
			method="post"
			classes="w1 down"
			redirect="/admin/matchcards"
			buttonText="Guardar combates"
			updateId={_inner.matchCard?.id}
		>
			<input type="hidden" name="slug" bind:value={_inner.slug} />
			<input type="hidden" name="ppv_card_id" bind:value={_inner.matchCard.id} />

			<div class="w1 grid ppv-matches-container">
				{#each matches as match, index}
					{@const _id = match.id === 0 ? `create-${index}` : match.id}
					{@const key = `match[${_id}]`}
					<div
						class="w1 match box relative match-type-{match.type}"
						style="order: {match.order}"
						data-identifier={_id}
					>
						<h3 class="match-title">
							Combate {match.order}
							{#if match.type === 'create'}
								<span class="badge small cta">Nuevo</span>
							{/if}
							{#if index === 0 || index === matches.length - 1}
								<span class="badge small">{index === 0 ? 'Opener' : 'Main event'}</span>
							{/if}
						</h3>

						<input type="hidden" name="matches[]" value={_id} />
						<input type="hidden" name="{key}[identifier]" value={match.id} />
						<input type="hidden" name="{key}[stipulation]" value={match.stipulation} />
						<input type="hidden" name="{key}[championship]" value={match.championship} />
						<input type="hidden" name="{key}[participants]" value={match.participants} />
						<input type="hidden" name="{key}[night]" value={match.night} />
						<input type="hidden" name="{key}[type]" value={match.type} />

						<div class="action-buttons-container">
							<button
								type="button"
								class="btn small danger"
								aria-label="Eliminar combate"
								onclick={handleToggleDelete(match)}
							>
								<i class="bi bi-trash"></i>
							</button>
						</div>
					</div>
				{/each}
			</div>

			<div class="w1 flex end"></div>
		</AsyncForm>
	</div>
</div>

<style>
	:root {
		--matches-rows: 2;
	}
	.grid.ppv-matches-container {
		display: grid;
		grid-template-columns: repeat(var(--matches-rows), 1fr);
		gap: 15px;
	}
	.sticky-page-header {
		position: relative;
		top: 0;
		left: 0;
		width: calc(100% + 30px);
		background: #fff;
		padding: 15px;
		margin: 0 -15px;
		margin-top: -15px;
		display: flex;
		align-items: center;
		gap: 15px;
		border-radius: 0 0 10px 10px;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
		font-size: 0.7rem;
		z-index: 5;
	}
	.sticky-page-header h1.page-title {
		font-size: 1.2rem !important;
	}

	.match.box {
		border-radius: 6px;
		border: 1px solid #ccc;
	}
	.match.match-type-delete {
		opacity: 0.5;
		border: 2px solid red;
	}
	.match .match-title {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.fixed-create-match-button {
		position: fixed;
		top: 20px;
		right: 20px;
		border-radius: 25px;
		z-index: 5;
	}
	.match-card-matches-footer {
		width: calc(100% - var(--sidebar-width));
		position: fixed;
		padding: 20px 15px;
		top: 0;
		left: 0;
		background: white;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
		margin-left: var(--sidebar-width);
		border-radius: 0 0 10px 10px;
		z-index: 10;
	}

	.match.box.relative.hidden {
		display: none;
	}

	@media only screen and (max-width: 768px) {
		.grid.ppv-matches-container {
			--matches-rows: 1;
		}
	}
</style>
