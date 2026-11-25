<script lang="ts">
	import AsyncForm from '$lib/components/forms/async-form.svelte';
	let { data } = $props();
	const year = new Date().getFullYear();
</script>

<div class="bulk-update-container">
	<AsyncForm method="post" showButtons={false} action="bulk_update" redirect={data.adminMainRoute}>
		<div class="ppvs-list">
			{#each data.ppvs as ppv}
				<div class="ppv-item">
					<input type="hidden" name="ppvs[]" value={ppv.id} />
					<img width="50" src={ppv.image} alt={ppv.name} class="ppv-image" />
					<label class="form-label">
						<span class="form-label-text">Nombre</span>
						<input type="text" name="ppvs[{ppv.id}][name]" value={ppv.name} />
					</label>

					<label class="form-label">
						<span class="form-label-text">Fecha</span>
						<input type="text" name="ppvs[{ppv.id}][annual_order]" value={ppv.annual_order} />
					</label>

					<label class="form-label">
						<span class="form-label-text">Fecha</span>
						<input type="text" name="ppvs[{ppv.id}][abbreviation]" value={ppv.abbreviation} />
					</label>

					<label class="form-label">
						<span class="form-label-text">Fecha</span>
						<input
							type="date"
							name="ppvs[{ppv.id}][date]"
							value={ppv.game_date.getCustomIsoFormat()}
							min={`${year - 1}-01-01`}
							max={`${year + 1}-12-31`}
						/>
					</label>
				</div>
			{/each}
		</div>

		<div class="buttons-container">
			<button type="submit" class="btn cta">Actualizar PPVs</button>
		</div>
		<!-- <pre>{JSON.stringify(data.ppvs, null, 4)}</pre> -->
	</AsyncForm>
</div>

<style>
	.bulk-update-container {
		margin: 0 auto;
		max-width: 1200px;
	}

	.ppv-item {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
		place-items: center;
		align-items: center;
		background-color: #fff;
		border: 1px solid #ddd;
		border-radius: 8px;
		padding: 8px 20px;
		gap: 20px;
		box-shadow:
			0 2px 4px rgba(0, 0, 0, 0.1),
			0 4px 8px rgba(0, 0, 0, 0.1);
	}
	.ppv-item img.ppv-image {
		max-width: 100%;
		border-radius: 8px 0 0 8px;
		object-fit: cover;
	}

	.buttons-container {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		margin-top: 20px;
		gap: 5px;
	}
</style>
