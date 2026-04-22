<script lang="ts">
	let { match = $bindable(), matches, handleToggleDelete, handleChangeOrder } = $props();
	let key = $derived(`match[${match.id}]`);
	let tmpInput: HTMLInputElement;

	const handleAddToTextarea = (type: 'vs' | 'wrestler' | 'champion') => () => {
		const participants = match.participants?.trim() || '';

		let valueToAdd = '';
		if (type === 'vs' && participants) {
			valueToAdd = ' VS';
		} else if (type === 'wrestler') {
			const wrestler = tmpInput?.value.trim();
			if (!wrestler) return;

			valueToAdd = participants ? ` ${wrestler}` : wrestler;
			tmpInput.value = '';
		} else if (type === 'champion' && participants) {
			valueToAdd = ' (c)';
		}

		match.participants = participants + valueToAdd;
	};
</script>

<div class="w1 match box relative match-type-{match.type}" data-identifier={match.id}>
	<h3 class="match-title">
		Combate {match.order}
		<div class="match-title-badges">
			{#if match.type === 'create'}
				<span class="badge small create-badge">Creacion</span>
			{/if}
			{#if match.order === 1 || match.order === matches}
				<span class="badge small">{match.order === 1 ? 'Opener' : 'Main event'}</span>
			{/if}
		</div>
	</h3>

	<input type="hidden" name="matches[{match.type}]" value={match.id} />
	<input type="hidden" name="{key}[order]" value={match.order} />
	<input type="hidden" name="{key}[type]" value={match.type} />

	<div class="w1 down flex column start astart gap-small">
		<label class="form-label form-item">
			<span class="label form-label">Estipulacion</span>
			<input
				type="text"
				list="stipulations"
				name="{key}[stipulation]"
				value={match.stipulation}
				class="form-input"
			/>
		</label>
		<label class="form-label form-item">
			<span class="label form-label">Campeonato</span>
			<input
				type="text"
				list="championships"
				name="{key}[championship]"
				value={match.championship}
				class="form-input"
			/>
		</label>

		<label class="form-label form-item textarea-whole-container">
			<span class="label form-label">Participantes</span>
			<div class="w1 textarea-container flex column">
				<textarea name="{key}[participants]" value={match.participants} class="form-input"
				></textarea>
				<input
					id="wrestler-input-{match.id}"
					bind:this={tmpInput}
					type="text"
					list="wrestlers"
					placeholder="Añadir luchador..."
					class="form-input wrestler-selector"
				/>
				<div class="w1 flex total start acenter nogap textarea-buttons-container">
					<button type="button" class="btn small" onclick={handleAddToTextarea('vs')}>
						<span class="label">VS</span>
					</button>
					<button type="button" class="btn small icon" onclick={handleAddToTextarea('wrestler')}>
						<i class="bi bi-plus-circle"></i>
						<span class="label">Luchador</span>
					</button>
					<button type="button" class="btn small" onclick={handleAddToTextarea('champion')}>
						<span class="label">Campeón</span>
					</button>
				</div>
			</div>
		</label>

		<div class="form-label form-item nights-container">
			<span class="label form-label">Noche</span>
			<div class="nights-label-container">
				<label class="relative">
					<input
						type="radio"
						name="{key}[night]"
						value={1}
						bind:group={match.night}
						class="form-input app-radio first-night"
					/>
					<span class="label inner">Noche 1</span>
				</label>
				<label class="relative">
					<input
						type="radio"
						name="{key}[night]"
						bind:group={match.night}
						value={2}
						class="form-input app-radio second-night"
					/>
					<span class="label inner">Noche 2</span>
				</label>
			</div>
		</div>

		<div
			class="w1 flex between gap-5 order-buttons"
			class:single={match.order == 1 || match.order >= matches}
			class:delete={match.type === 'delete'}
		>
			{#if match.order < matches}
				<button
					type="button"
					class="btn order-move-button"
					aria-label="Mover combate hacia abajo"
					onclick={handleChangeOrder(match, 'down')}
				>
					<i class="bi bi-arrow-down"></i>
					<span>Bajar orden</span>
				</button>
			{/if}
			{#if match.order > 1}
				<button
					type="button"
					class="btn order-move-button"
					aria-label="Mover combate hacia arriba"
					onclick={handleChangeOrder(match, 'up')}
				>
					<i class="bi bi-arrow-up"></i>
					<span>Subir orden</span>
				</button>{/if}
		</div>
	</div>

	<div class="action-buttons-container">
		<button
			type="button"
			class="btn danger"
			aria-label="Eliminar combate"
			onclick={() => handleToggleDelete(match)}
		>
			<i class="bi bi-{match.type === 'delete' ? 'x' : 'trash'}"></i>
		</button>
	</div>
</div>

<style>
	.match.box {
		border-radius: 6px;
		border: 1px solid #aaa;
		transition: all 0.1s ease-in-out;
	}
	.match.match-type-delete {
		border: 2px solid red;
		opacity: 0.7;
	}
	.match .match-title {
		display: flex;
		align-items: center;
		gap: 10px;
	}
	.match .match-title .match-title-badges {
		display: flex;
		gap: 2px;
	}
	.match.box textarea {
		min-height: 80px;
	}

	.match .badge.create-badge {
		background-color: #28a745;
		color: white;
	}
	.match .nights-label-container {
		width: 100%;
		display: flex;
		align-self: center;
		gap: 10px;
	}
	.match .nights-label-container > label {
		width: 100%;
		flex: 1;
	}
	.match .nights-label-container > label span.inner {
		width: 100%;
		display: block;
		text-align: center;
		border: 1px solid #333;
		box-shadow: none;
		border-radius: 25px;
		font-size: 0.85rem;
		padding: 5px;
	}
	.match .nights-label-container > label input.first-night:checked + span.inner {
		background-color: #28a745;
		border-color: #28a745;
		color: white;
	}
	.match .nights-label-container > label input.second-night:checked + span.inner {
		background-color: #7fb7f4;
		border-color: #7fb7f4;
		color: white;
	}
	.match .textarea-whole-container .textarea-container {
		gap: 0;
	}
	.match .textarea-whole-container .textarea-container textarea {
		border-bottom: 0;
		border-radius: 5px 5px 0 0;
		border-color: #ccc;
	}
	.match .textarea-whole-container .textarea-container input.wrestler-selector {
		border-radius: 0;
		border-color: #ccc;
		background-color: #fff;
		padding: 8px 12px;
	}
	.match .textarea-whole-container .textarea-container .textarea-buttons-container {
		border: 1px solid #ccc;
		border-top: 0;
		border-radius: 0 0 5px 5px;
	}
	.match .textarea-whole-container .textarea-container .textarea-buttons-container button {
		background-color: transparent;
		border: none;
		padding: 8px 12px;
		border-radius: 0;
		border-right: 1px solid #ccc;
	}
	.match
		.textarea-whole-container
		.textarea-container
		.textarea-buttons-container
		button:last-child {
		border-right: none;
	}

	.order-buttons {
		display: flex;
		align-items: stretch;
	}
	.order-buttons.single {
		justify-content: flex-end;
		align-items: center;
	}

	.order-buttons.delete {
		display: none;
	}
	.order-buttons button.order-move-button {
		background-color: #fff;
		border: 1px solid #333;
		padding: 8px 20px;
		color: #333;
		border-radius: 8px;
		align-self: stretch;
	}
</style>
