<script lang="ts">
	import AsyncForm from '$lib/components/forms/async-form.svelte';
	import ImageInput from '$lib/components/forms/inputs/image-input.svelte';
	import Input from '$lib/components/forms/inputs/input.svelte';
	import type { Match } from '@prisma/client';

	export let data;
	const pagedatas = data.match_card;
	let matches: Match[] = pagedatas.matches;
	let ppvName = pagedatas.matchCard?.ppv_name || '';
	let ppvImage = pagedatas.matchCard?.ppv_image || '';

	const handleCreateMatch = async (event: Event) => {
		const form = event.target as HTMLFormElement;
		const formData = new FormData(form);

		matches = [
			...matches,
			{
				id: 0,
				duration: null,
				created_at: null,
				updated_at: null,
				id_match_card: 1,
				order: 1,
				stipulation: formData.get('match_stipulation') as string,
				championship: formData.get('match_championship') as string,
				participants: formData.get('match_participants') as string,
				winner: null,
				rating: null
				// Add other match properties as needed
			}
		];
		// Handle match creation logic here
	};
</script>

<div class="matchcard-page">
	<datalist id="wrestlers">
		{#each pagedatas.wrestlers as wrestler}
			<option value={wrestler.name}>{wrestler.name}</option>
		{/each}
	</datalist>

	<form method="post" class="w1 box" on:submit|preventDefault={handleCreateMatch}>
		<div class="match-create-datas flex column gap-small">
			<Input
				name="match_stipulation"
				label="Tipo de combate"
				placeholder="Tag Team No Holds Barred Match"
				required
			/>
			<Input
				name="match_championship"
				label="Championship"
				placeholder="WWE Championship"
				options={pagedatas.championships.map((champ) => champ.name as string)}
			/>

			<label class="form-item">
				<span class="label form-label">Luchadores</span>
				<textarea class="input" name="match_participants" rows="2" required></textarea>
			</label>

			<div class="w1 flex end">
				<button type="submit" class="button btn cta">Crear Combate</button>
			</div>
		</div>
	</form>

	<AsyncForm method="post" classes="down w1" redirect="/admin/matchcards">
		<input type="hidden" name="slug" bind:value={pagedatas.slug} />
		<input type="hidden" name="_action" value={pagedatas.isUpdate ? 'update' : 'create'} />

		<div class="flex column gap-medium">
			<div class="w1 ppv-container box flex column gap-medium astart">
				<h2 class="uppercase dreadnotus">Evento</h2>
				<div class="w1 flex between responsive gap-small ppv-datas astart">
					<Input type="text" label="Nombre de PPV" name="ppv_name" bind:value={ppvName} />
					<ImageInput label="Imagen de PPV" name="ppv_image" bind:image={ppvImage} />
				</div>
			</div>

			{#if matches.length > 0}
				<div class="w1 box ppv-matches-container flex column gap-medium astart">
					<h2 class="uppercase dreadnotus">Combates</h2>
					{#each matches as match}
						<div class="w1 match box" style="order: {match.order}">
							<input type="hidden" class="input" name="match_id[]" bind:value={match.id} />

							<div class="datas">
								<label class="form-item">
									<span class="label">Tipo de combate</span>
									<input
										type="text"
										class="input"
										name="match_stipulation[]"
										bind:value={match.stipulation}
									/>
								</label>

								<label class="form-item">
									<span class="label">Championship</span>
									<input
										type="text"
										class="input"
										name="match_championship[]"
										bind:value={match.championship}
									/>
								</label>

								<label class="form-item">
									<span class="label">Championship</span>
									<textarea
										class="input"
										name="match_participants[]"
										bind:value={match.participants}
									></textarea>
								</label>

								<!-- <div class="exclusive-optional-datas">
									<label class="form-item">
										<span class="label">Ganador</span>
										<input
											type="text"
											class="input"
											name="match_winner[]"
											bind:value={match.winner}
										/>
									</label>

									<label class="form-item">
										<span class="label">Calificación</span>
										<input
											type="number"
											class="input"
											name="match_rating[]"
											bind:value={match.rating}
										/>
									</label>

									<label class="form-item">
										<span class="label">Duracion <small>(minutos)</small></span>
										<input
											type="number"
											class="input"
											name="match_duration[]"
											bind:value={match.duration}
										/>
									</label>
								</div> -->
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	</AsyncForm>
</div>
