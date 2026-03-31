<script lang="ts">
	// import type { MatchObject } from './types';

	let { match = $bindable(), index, matches } = $props();
	let key = $derived(`match[${match.type}][${match.id}]`);
	let tmpInput: HTMLInputElement;

	const handleToggleDelete = () => {
		if (match.type === 'create') return;
		match.type = match.type === 'delete' ? 'update' : 'delete';
	};

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

<div
	class="w1 match box relative match-type-{match.type}"
	style="order: {match.night * 10 + match.order}"
	data-identifier={match.id}
>
	<h3 class="match-title">
		Combate {match.order}
		<div class="flex nogap order-buttons">
			<button
				type="button"
				class="btn small order-move-button"
				aria-label="Mover combate hacia arriba"
			>
				<i class="bi bi-arrow-up"></i>
			</button>
			<button
				type="button"
				class="btn small order-move-button"
				aria-label="Mover combate hacia abajo"
			>
				<i class="bi bi-arrow-down"></i>
			</button>
		</div>

		{#if match.type === 'create'}
			<span class="badge small cta">Nuevo</span>
		{/if}
		{#if index === 0 || index === matches.length - 1}
			<span class="badge small">{index === 0 ? 'Opener' : 'Main event'}</span>
		{/if}
	</h3>

	<input type="hidden" name="matches[{match.type}]" value={match.id} />
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
						class="form-input app-radio"
					/>
					<span class="label inner">Noche 1</span>
				</label>
				<label class="relative">
					<input
						type="radio"
						name="{key}[night]"
						bind:group={match.night}
						value={2}
						class="form-input app-radio"
					/>
					<span class="label inner">Noche 2</span>
				</label>
			</div>
		</div>
	</div>

	<div class="action-buttons-container">
		<button
			type="button"
			class="btn danger"
			aria-label="Eliminar combate"
			onclick={handleToggleDelete}
		>
			<i class="bi bi-{match.type === 'delete' ? 'x' : 'trash'}"></i>
		</button>
	</div>
</div>

<style>
	.match.box {
		border-radius: 6px;
		border: 1px solid #aaa;
		transition: all 0.2s ease-in-out;
	}
	.match.match-type-delete {
		border: 2px solid red;
	}
	.match .match-title {
		display: flex;
		align-items: center;
		gap: 10px;
	}
	.match.box textarea {
		min-height: 80px;
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
	.match .nights-label-container > label input:checked + span.inner {
		background-color: #333;
		border-color: #333;
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
	.order-buttons button.order-move-button {
		background-color: #fff;
		border: 1px solid #333;
		padding: 8px 10px;
		color: #333;
		border-radius: 5px 0 0 5px;
		align-self: stretch;
	}
	.order-buttons button.order-move-button:last-child {
		border-radius: 0 5px 5px 0;
		border-left: none;
	}
</style>
