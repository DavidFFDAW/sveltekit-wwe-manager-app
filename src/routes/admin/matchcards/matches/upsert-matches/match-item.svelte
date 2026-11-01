<script lang="ts">
	let { match = $bindable(), matches, handleToggleDelete, handleChangeOrder } = $props();
	let key = $derived(`match[${match.id}]`);
	let tmpInput = $state<HTMLInputElement>();
	const handleAddToTextarea = (type: 'vs' | 'wrestler' | 'champion') => () => {
		const participants = match.participants?.trim() || '';
		let valueToAdd = '';
		if (type === 'vs' && participants) valueToAdd = ' VS';
		else if (type === 'wrestler') {
			const wrestler = tmpInput?.value.trim();
			if (!wrestler) return;
			valueToAdd = participants ? ` ${wrestler}` : wrestler;
			if (tmpInput) tmpInput.value = '';
		} else if (type === 'champion' && participants) valueToAdd = ' (c)';
		match.participants = participants + valueToAdd;
	};
</script>

<div class="match-row" class:pending-delete={match.type === 'delete'} data-identifier={match.id}>
	<input type="hidden" name="matches[{match.type}]" value={match.id} />
	<input type="hidden" name="{key}[type]" value={match.type} />
	<div class="order-cell">
		<label
			><span>Orden</span><input
				type="number"
				name="{key}[order]"
				bind:value={match.order}
				min="1"
				max={matches}
				readonly={match.type === 'delete'}
			/></label
		>
		<div class="order-buttons">
			<button
				type="button"
				aria-label="Subir combate {match.order}"
				title="Subir combate"
				disabled={match.type === 'delete' || match.order <= 1}
				onclick={handleChangeOrder(match, 'up')}
				><i class="bi bi-arrow-up" aria-hidden="true"></i></button
			>
			<button
				type="button"
				aria-label="Bajar combate {match.order}"
				title="Bajar combate"
				disabled={match.type === 'delete' || match.order >= matches}
				onclick={handleChangeOrder(match, 'down')}
				><i class="bi bi-arrow-down" aria-hidden="true"></i></button
			>
		</div>
		{#if match.type === 'create'}<small class="new-badge">Nuevo</small>{/if}
	</div>
	<div class="participants-cell">
		<label
			><span>Participantes</span><textarea
				name="{key}[participants]"
				bind:value={match.participants}
				rows="2"
				placeholder="Luchador VS Luchador"
				readonly={match.type === 'delete'}
			></textarea></label
		>
		{#if match.type !== 'delete'}
			<details class="participant-tools">
				<summary>Insertar luchador / VS / campeón</summary>
				<div class="tools">
					<input
						bind:this={tmpInput}
						type="text"
						list="wrestlers"
						placeholder="Buscar luchador…"
						aria-label="Buscar luchador para el combate {match.order}"
						onkeydown={(event) => {
							if (event.key === 'Enter') {
								event.preventDefault();
								handleAddToTextarea('wrestler')();
							}
						}}
					/>
					<button type="button" onclick={handleAddToTextarea('wrestler')}>Añadir</button>
					<button type="button" onclick={handleAddToTextarea('vs')}>VS</button>
					<button type="button" onclick={handleAddToTextarea('champion')}>(c)</button>
				</div>
			</details>
		{/if}
	</div>
	<div class="details-cell">
		<label
			><span>Estipulación</span><input
				type="text"
				list="stipulations"
				name="{key}[stipulation]"
				bind:value={match.stipulation}
				placeholder="Single Match"
				readonly={match.type === 'delete'}
			/></label
		>
		<label
			><span>Campeonato</span><input
				type="text"
				list="championships"
				name="{key}[championship]"
				bind:value={match.championship}
				placeholder="Sin campeonato"
				readonly={match.type === 'delete'}
			/></label
		>
	</div>
	<div class="night-cell">
		<label
			><span>Noche</span><select name="{key}[night]" bind:value={match.night}
				><option value={1}>Noche 1</option><option value={2}>Noche 2</option></select
			></label
		>
		<button
			type="button"
			class="delete-button"
			class:undo={match.type === 'delete'}
			aria-label={match.type === 'delete'
				? `Deshacer eliminación del combate ${match.order}`
				: `Eliminar combate ${match.order}`}
			title={match.type === 'delete' ? 'Deshacer eliminación' : 'Eliminar combate'}
			onclick={() => handleToggleDelete(match)}
			><i
				class="bi bi-{match.type === 'delete' ? 'arrow-counterclockwise' : 'trash'}"
				aria-hidden="true"
			></i><span>{match.type === 'delete' ? 'Deshacer' : 'Eliminar'}</span></button
		>
	</div>
	{#if match.type === 'delete'}<p class="delete-notice">
			Este combate se eliminará al guardar los cambios.
		</p>{/if}
</div>

<style>
	.match-row {
		display: grid;
		grid-template-columns: 66px minmax(0, 1.5fr) minmax(0, 1fr) 106px;
		gap: 16px;
		align-items: start;
		padding: 16px;
		border: 1px solid #e0e5ed;
		border-radius: 10px;
		background: #fff;
		color: #344054;
	}
	.match-row.pending-delete {
		border-color: #edbaba;
		background: #fff8f8;
	}
	label {
		display: flex;
		flex-direction: column;
		gap: 5px;
		min-width: 0;
		margin: 0;
	}
	label > span {
		font-size: 0.72rem;
		font-weight: 600;
		color: #667085;
		text-transform: none;
	}
	input,
	textarea,
	select {
		box-sizing: border-box;
		width: 100%;
		min-width: 0;
		min-height: 38px;
		margin: 0;
		padding: 8px 9px;
		border: 1px solid #d8dee8;
		border-radius: 6px;
		background: #fcfcfd;
		color: #172033;
		font: inherit;
		font-size: 0.85rem;
	}
	textarea {
		display: block;
		resize: vertical;
		min-height: 74px;
		line-height: 1.5;
	}
	input:focus-visible,
	textarea:focus-visible,
	select:focus-visible,
	button:focus-visible,
	summary:focus-visible {
		outline: 2px solid #7da6ef;
		outline-offset: 2px;
	}
	.order-cell,
	.details-cell,
	.night-cell {
		display: grid;
		gap: 8px;
		min-width: 0;
	}
	.order-cell input {
		text-align: center;
		padding-inline: 2px;
	}
	button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 6px;
		min-height: 36px;
		padding: 6px 8px;
		border: 1px solid #d8dee8;
		border-radius: 6px;
		background: #fff;
		color: #475467;
		font: inherit;
		font-size: 0.75rem;
		cursor: pointer;
	}
	button:hover:not(:disabled) {
		background: #edf3ff;
		color: #215cc5;
	}
	button:disabled {
		opacity: 0.35;
		cursor: default;
	}
	.order-buttons {
		display: flex;
		gap: 4px;
	}
	.order-buttons button {
		flex: 1;
		padding-inline: 4px;
	}
	.new-badge {
		text-align: center;
		color: #187246;
		background: #eaf7ef;
		border-radius: 4px;
		padding: 3px;
		font-size: 0.65rem;
	}
	.participants-cell {
		min-width: 0;
	}
	.participant-tools summary {
		padding: 8px 0 0;
		color: #596579;
		font-size: 0.72rem;
		cursor: pointer;
	}
	.tools {
		display: flex;
		gap: 5px;
		flex-wrap: wrap;
		padding-top: 8px;
	}
	.tools input {
		flex: 1 1 120px;
		width: 0;
	}
	.delete-button {
		margin-top: 2px;
		border-color: transparent;
		color: #bd3030;
		min-height: 38px;
	}
	.delete-button:hover:not(:disabled) {
		background: #fff0f0;
		color: #bd3030;
	}
	.delete-button.undo {
		color: #215cc5;
	}
	.delete-notice {
		grid-column: 1 / -1;
		margin: 0;
		color: #b12e2e;
		font-size: 0.78rem;
	}
	@media (max-width: 1000px) and (min-width: 641px) {
		.match-row {
			grid-template-columns: 60px minmax(0, 1fr) 106px;
			gap: 12px;
		}
		.participants-cell {
			grid-column: 2;
			grid-row: 1;
		}
		.details-cell {
			grid-column: 2;
			grid-row: 2;
			grid-template-columns: 1fr 1fr;
		}
		.night-cell {
			grid-column: 3;
			grid-row: 1 / 3;
		}
		.order-cell {
			grid-row: 1 / 3;
		}
	}
	@media (max-width: 640px) {
		.match-row {
			grid-template-columns: 64px minmax(0, 1fr);
			gap: 14px 12px;
			padding: 14px;
		}
		.participants-cell {
			grid-column: 1 / -1;
			grid-row: 2;
		}
		.details-cell {
			grid-column: 1 / -1;
		}
		.night-cell {
			grid-column: 2;
			grid-row: 1;
			grid-template-columns: minmax(0, 1fr) auto;
			align-items: end;
		}
		.night-cell button {
			min-height: 42px;
		}
		.order-buttons button {
			min-height: 40px;
		}
		input,
		textarea,
		select {
			font-size: 16px;
			min-height: 42px;
		}
		.tools button {
			min-height: 42px;
		}
	}
</style>
