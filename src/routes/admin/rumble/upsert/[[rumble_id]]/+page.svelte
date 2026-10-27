<script lang="ts">
	import AsyncForm from '$lib/components/forms/async-form.svelte';
	import NumberInputControls from '$lib/components/forms/inputs/number-input-controls.svelte';
	import ToggleInput from '$lib/components/forms/inputs/toggle-input.svelte';
	import HorizontalListSelect from '$lib/components/visual/horizontal-list-select.svelte';
	import Image from '$lib/components/visual/image.svelte';

	let { data } = $props();
	let search = $state('');
	let filteredWrestlers = data.wrestlers.slice(0, 10);
</script>

<section>
	<header class="page-header">
		<span class="badge rumble-badge">Royal Rumble</span>
		<h1>{data.isUpdate ? 'Editar ganador' : 'Crear ganador'}</h1>
	</header>

	<AsyncForm method="post" showButtons={false} redirect="/admin/rumble">
		<div class="rumble-panels">
			<HorizontalListSelect
				list={data.wrestlers}
				title="Selecciona un luchador"
				value={data.rumble?.winner_id}
				name="winner_id"
			/>

			<div class="panel">
				<div class="details-header">
					<i class="bi bi-trophy" aria-hidden="true"></i>
					<h2>Datos del Royal Rumble</h2>
				</div>
				<div class="details-content">
					<NumberInputControls
						label="Año del Royal Rumble"
						name="year"
						min="1988"
						max="9999"
						value={Number(data.rumble?.year ?? data.currentYear)}
						required
					/>
					<NumberInputControls
						label="Posición de entrada"
						name="entry_number"
						min="1"
						max="30"
						value={data.rumble?.entry_number ?? 25}
						required
					/>
					<ToggleInput
						label="¿Tuvo éxito en WrestleMania?"
						name="successful"
						checked={data.rumble?.successful ?? false}
					/>
					<div class="form-actions">
						<a href="/admin/rumble" class="btn secondary">Cancelar</a>
						<button type="submit" class="btn cta" disabled={!data.wrestlers.length}>
							<i class="bi bi-check-lg" aria-hidden="true"></i>
							{data.isUpdate ? 'Guardar cambios' : 'Crear ganador'}
						</button>
					</div>
				</div>
			</div>
		</div>
	</AsyncForm>
</section>

<style>
	.panel {
		padding: 0;
	}
	.rumble-badge {
		background: #fff6dd;
		border: 3px solid #d8c9a1;
		color: #8a6400;
	}
	.rumble-panels {
		display: grid;
		grid-template-columns: minmax(0, 1fr) 360px;
		gap: 24px;
		align-items: start;
	}
	.panel {
		min-width: 0;
		background: #fff;
		border: 1px solid #ccc;
		border-radius: 8px;
		box-shadow: 0 2px 4px #0000001a;
		overflow: hidden;
	}
	h2 {
		font-size: 18px;
		margin: 0 0 16px;
	}
	.details-header {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 25px;
		color: #fff;
		background:
			radial-gradient(circle at top right, #f4c84f66, transparent 55%),
			linear-gradient(145deg, #151c2d, #0f172a);
	}
	.details-header i {
		display: block;
		font-size: 32px;
	}
	.details-header h2 {
		margin: 0;
	}
	.details-content {
		display: flex;
		flex-direction: column;
		gap: 24px;
		padding: 20px 15px;
	}
	.form-actions {
		display: flex;
		justify-content: flex-end;
		flex-wrap: wrap;
		gap: 10px;
		border-top: 1px solid #ddd;
		padding-top: 20px;
	}
	@media (max-width: 900px) {
		.rumble-panels {
			grid-template-columns: 1fr;
		}
	}
</style>
