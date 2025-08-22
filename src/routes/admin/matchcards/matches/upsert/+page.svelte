<script lang="ts">
	import AsyncForm from '$lib/components/forms/async-form.svelte';
	import MatchWrestlers from '../../match-wrestlers.svelte';
	import { scrollToElement } from '$lib/utils/dom.utils';
	import SingleMatch from '../../single-match.svelte';
	import Input from '$lib/components/forms/inputs/input.svelte';
	import { httpRawRequest } from '$lib/services/http.service';
	import type { MatchItem } from '../../types';

	export let data;
	let showCreateMatch = false;
	const pagedatas = data.match_card;
	// let matches: (Match & { inner_identifier?: number })[] = pagedatas.matches;
	let matches: MatchItem[] = pagedatas.matches.map((m) => ({
		...m,
		inner_identifier: Date.now() + Math.floor(Math.random() * 1000)
	}));

	const handleCreateMatch = async (event: Event) => {
		const form = event.target as HTMLFormElement;
		if (!form.reportValidity()) return 0;
		const formData = new FormData(form);
		const identifier = Date.now();
		const maxOrder = matches.length > 0 ? Math.max(...matches.map((m) => m.order || 0)) : 0;

		matches = [
			...matches,
			{
				id: 0,
				duration: null,
				created_at: null,
				updated_at: null,
				id_match_card: 1,
				order: maxOrder + 1,
				stipulation: formData.get('match_stipulation') as string,
				championship: formData.get('match_championship') as string,
				participants: formData.get('match_participants') as string,
				winner: null,
				inner_identifier: identifier,
				rating: null
				// Add other match properties as needed
			}
		];

		setTimeout(() => {
			scrollToElement(`.match[data-identifier="${identifier}"]`, 500);
			// Handle match creation logic here
		}, 250);
	};

	const deleteMatchItem = async (match: MatchItem) => {
		if (!confirm('¿Estás seguro de que deseas eliminar este combate?')) return;

		matches = matches.filter((m) => m.inner_identifier !== match.inner_identifier);

		if (match.id && match.id > 0) {
			httpRawRequest(`/api/ppv/card/match/${match.id}?ppv=${pagedatas.matchCard?.id}`, {
				method: 'DELETE'
			}).catch((error) => {
				console.error('Error deleting match:', error);
				matches = [...matches, match];
			});
		}
	};

	$: lastMatchOrder = matches.length > 0 ? Math.max(...matches.map((m) => m.order || 0)) : 1;
</script>

<div class="matchcard-page">
	<datalist id="wrestlers">
		{#each pagedatas.wrestlers as wrestler}
			<option value={wrestler.name}>{wrestler.name}</option>
		{/each}
	</datalist>

	<header class="page-header">
		<h1 class="page-title">Combates</h1>
		<small class="page-subtitle-ppv">
			Combates del evento <strong>{data.match_card.matchCard?.ppv_name}</strong>
		</small>
	</header>

	{#if showCreateMatch}
		<footer class="w1 match-card-matches-footer">
			<button
				type="button"
				class="btn unbutton absolute top right"
				aria-label="Close"
				on:click={() => (showCreateMatch = false)}
			>
				<i class="bi bi-x"></i>
			</button>

			<form
				action=""
				method="post"
				class="flex column gap-small"
				style="padding-top: 10px;"
				on:submit|preventDefault={handleCreateMatch}
			>
				<div class="w1 grid grid-two-column gap-smaller responsive">
					<Input
						label="Tipo de combate"
						name="match_stipulation"
						type="text"
						required={true}
						placeholder="Singles No Holds Barred Match"
						options={['Singles match', 'Tag team match']}
					/>
					<Input
						label="Campeonato"
						name="match_championship"
						type="text"
						required={false}
						placeholder="WWE World Heavyweight Championship"
						options={pagedatas.championships.map((chp) => chp.name as string)}
					/>
				</div>

				<MatchWrestlers name="match_participants" datasetList="wrestlers" />
				<div class="w1 flex end gap-smaller">
					<button type="submit" class="btn cta">Crear combate</button>
				</div>
			</form>
		</footer>
	{:else}
		<button
			type="button"
			on:click={() => (showCreateMatch = !showCreateMatch)}
			class="btn fixed-create-match-button cta"
		>
			<i class="bi bi-plus"></i> Añadir combate
		</button>
	{/if}

	<AsyncForm
		method="post"
		classes="w1 down"
		redirect="/admin/matchcards"
		buttonText="Guardar cambios"
		updateId={pagedatas.matchCard?.id}
	>
		<input type="hidden" name="slug" bind:value={pagedatas.slug} />
		<input type="hidden" name="_action" value={pagedatas.isUpdate ? 'update' : 'create'} />

		<div class="w1 flex column gap-medium">
			{#if matches.length > 0}
				<div class="w1 ppv-matches-container flex column gap-medium astart">
					{#each matches as match}
						<div class="w1 match box relative" data-identifier={match.inner_identifier}>
							<h3>
								Combate {match.order}
								<small>
									{match.order === lastMatchOrder
										? 'Main Event'
										: match.order === 1
											? 'Opener'
											: ''}
								</small>
							</h3>
							<div class="action-buttons-container">
								<button
									type="button"
									class="btn small danger"
									aria-label="Eliminar combate"
									on:click|preventDefault={() => deleteMatchItem(match)}
								>
									<i class="bi bi-trash"></i>
								</button>
							</div>
							<SingleMatch bind:match bind:matches />
						</div>
					{/each}
				</div>
			{/if}
		</div>
	</AsyncForm>
</div>

<style>
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

	@media only screen and (max-width: 768px) {
		.match-card-matches-footer {
			width: 100%;
			margin-left: 0;
			padding-top: 35px;
		}
	}
</style>
