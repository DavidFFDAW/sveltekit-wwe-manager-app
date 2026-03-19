<script lang="ts">
	import Dialog from '$lib/components/dialog/dialog.svelte';
	import AsyncForm from '$lib/components/forms/async-form.svelte';
	import { Toast } from '$lib/utils/toast.helper';

	let { data } = $props();
	let _inner = $state(data.match_card);
	const ppv = data.match_card.matchCard.id;
	let matches = $state(data.match_card.matches);
	let orders = $derived(matches.map((m) => m.order));
	let showCreateMatch = $state(false);

	const handleSubmit = (e: Event) => {
		e.preventDefault();
		const form = e.target as HTMLFormElement;
		const formData = new FormData(form);
		const order = formData.get('order') as string;

		const match = {
			id: 0,
			type: 'create',
			order: order ? Number(order) : orders.length > 0 ? Math.max(...orders) + 1 : 1,
			stipulation: formData.get('stipulation') as string,
			championship: formData.get('championship') as string,
			participants: formData.get('participants') as string,
			night: (formData.get('night') as string) ? Number(formData.get('night')) : 1
		};

		matches = [...matches, match];
		Toast.success('Combate añadido');
		form.reset();
	};
</script>

<header class="page-header">
	<h1 class="page-title">Combates</h1>
	<small class="page-subtitle-ppv">
		Combates del evento <strong>{_inner.matchCard?.ppv_name}</strong>
	</small>
</header>

<div class="matchcard-page">
	<datalist id="wrestlers">
		{#each _inner.wrestlers as wrestler}
			<option value={wrestler.name}>{wrestler.name}</option>
		{/each}
	</datalist>

	<header class="sticky-page-header">
		<img
			width="80"
			draggable="false"
			src={_inner.matchCard.ppv_image}
			alt={_inner.matchCard.ppv_name}
			class="ppv-image"
		/>
		<h2>{_inner.matchCard.ppv_name}</h2>
	</header>

	<Dialog title="Eliminar combate" opened={showCreateMatch}>
		<form action="" method="post" class="new-match-form" onsubmit={handleSubmit}>
			<label class="form-label form-group">
				<span class="label">Estipulación</span>
				<input
					type="text"
					name="stipulation"
					class="form-control input"
					placeholder="Singles match"
					required
				/>
			</label>
			<label class="form-label form-group">
				<span class="label">Titulo</span>
				<input
					type="text"
					name="title"
					class="form-control input"
					placeholder="Championship match"
					required
				/>
			</label>

			<label class="form-label form-group">
				<span class="label">Participantes</span>
				<textarea name="participants" class="form-control input"></textarea>
			</label>

			<div class="form-actions">
				<button type="submit" class="btn danger">Añadir combate</button>
			</div>
		</form>
	</Dialog>

	<AsyncForm
		method="post"
		classes="w1 down"
		redirect="/admin/matchcards"
		buttonText="Guardar cambios"
		updateId={_inner.matchCard?.id}
	>
		<input type="hidden" name="slug" bind:value={_inner.slug} />
		<input type="hidden" name="ppv_card_id" bind:value={_inner.matchCard.id} />

		<div class="w1 flex between astart gap-medium">
			<div class="w1 ppv-matches-container flex column gap-medium astart">
				{#each matches as match, index}
					{@const _id = match.id === 0 ? `create-${index}` : match.id}
					{@const key = `match[${_id}]`}
					<div class="w1 match box relative" style="order: {match.order}" data-identifier={_id}>
						<h3>
							Combate {match.order}
						</h3>

						<input type="hidden" name="matches[]" value={_id} />
						<input type="hidden" name="{key}[identifier]" value={match.id} />
						<input type="hidden" name="{key}[stipulation]" value={match.stipulation} />
						<input type="hidden" name="{key}[championship]" value={match.championship} />
						<input type="hidden" name="{key}[participants]" value={match.participants} />
						<input type="hidden" name="{key}[night]" value={match.night} />
						<input type="hidden" name="{key}[type]" value={match.type} />

						<div class="action-buttons-container">
							<button type="button" class="btn small danger" aria-label="Eliminar combate">
								<i class="bi bi-trash"></i>
							</button>
						</div>
					</div>
				{/each}
			</div>

			<div class="w1 edition-panel">
				<h2>Panel de edición</h2>
				<p>Selecciona un combate para editar sus detalles</p>
			</div>
		</div>

		<button type="button" class="btn small" onclick={() => (showCreateMatch = true)}>
			<i class="bi bi-plus"></i>
			<span class="label">Añadir combate</span>
		</button>
	</AsyncForm>
</div>

<style>
	.edition-panel {
		min-height: 100dvh;
	}
	.sticky-page-header {
		position: sticky;
		top: 0;
		left: 0;
		width: calc(100% + 30px);
		background: #fff;
		padding: 15px;
		margin: 0 -15px;
		display: flex;
		align-items: center;
		gap: 15px;
		border-radius: 0 0 10px 10px;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
		font-size: 0.7rem;
		z-index: 5;
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
		.match-card-matches-footer {
			width: 100%;
			margin-left: 0;
			padding-top: 35px;
		}
	}
</style>
