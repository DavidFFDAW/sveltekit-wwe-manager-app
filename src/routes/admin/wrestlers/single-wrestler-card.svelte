<script lang="ts">
	import { errorimage } from '$lib/actions/error.image';
	import AsyncForm from '$lib/components/forms/async-form.svelte';
	import Image from '$lib/components/visual/image.svelte';
	import { WrestlerConstants } from '$lib/constants/wrestler.constants';
	import type { Wrestler } from '@prisma/client';

	export let wrestler: Wrestler;
</script>

<div class="wrestler-single-card-container">
	<AsyncForm action="" method="post" showButtons={false} reset={true} updateId={wrestler.id}>
		<div class="w1 relative box wrestler-single-card brand-{wrestler.brand.toLowerCase()}">
			<div class="image-container flex center acenter relative">
				<img
					draggable="false"
					src={wrestler.image_name as string}
					alt={wrestler.name as string}
					use:errorimage={'/vacant.webp'}
					width="200"
				/>
				<p class="badge overall-badge">
					{wrestler.overall}
				</p>
			</div>
			<div class="w1 fields flex column gap-small">
				<label class="form-item">
					<span class="label form-label">Nombre</span>
					<input type="text" name="name" class="input" value={wrestler.name} />
				</label>

				<label class="form-item">
					<span class="label form-label">Status</span>
					<select name="status" class="input select">
						{#each WrestlerConstants.statuses as status}
							<option value={status.value} selected={wrestler.status === status.value}>
								{status.label}
							</option>
						{/each}
					</select>
				</label>

				<label class="form-item">
					<span class="label form-label">Brand</span>
					<input
						type="number"
						name="overall"
						class="input"
						inputmode="numeric"
						bind:value={wrestler.overall}
						min="40"
						max="100"
					/>
				</label>
			</div>
			<div class="w1 flex end acenter">
				<button type="submit" class="btn cta icon">
					<i class="bi bi-save"></i>
					Actualizar
				</button>
			</div>
			<div class="action-buttons-container">
				<a href="/admin/wrestlers/update/{wrestler.id}" class="btn small warn">
					<i class="bi bi-pencil"></i> Editar
				</a>
			</div>
		</div>
	</AsyncForm>
</div>

<style>
	.wrestler-single-card .badge.overall-badge {
		position: absolute;
		top: 0;
		left: 0;
		background-color: #000;
		color: #fff;
		padding: 5px 10px;
		border-radius: 4px;
		font-weight: bold;
		font-size: 1rem;
		z-index: 10;
	}
	.wrestler-single-card {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	.wrestler-single-card .image-container {
		border-radius: 4px 8px 8px 8px;
		overflow: hidden;
	}
	.wrestler-single-card .fields {
		padding: 5px 0;
	}
</style>
