<script lang="ts">
	import { errorimage } from '$lib/actions/error.image';
	import Icon from '$lib/components/icons/icon.svelte';
	import OverflowableTable from '$lib/components/visual/overflowable-table.svelte';
	import { brands } from '$lib/constants/app';
	import { WrestlerConstants } from '$lib/constants/wrestler.constants';
	import type { ImportationDatas } from './importation.models';

	export let wrestlers: ImportationDatas[] = [];

	const removeWrestler = (wrestler: ImportationDatas) => (event: Event) => {
		event.preventDefault();
		wrestlers = wrestlers.filter((w) => w !== wrestler);
	};

	const addNewWrestlerItem = () => {
		wrestlers = [
			...wrestlers,
			{
				overall: 0,
				name: '',
				label: '',
				image: ''
			}
		];
	};
</script>

<div class="overflowable-table">
	<table>
		<thead>
			<tr>
				<th></th>
				<th>Imagen</th>
				<th>Nombre</th>
				<th>Media</th>
				<th>Brand</th>
				<th>Finisher</th>
				<th>Status</th>
				<th>Género</th>
				<th>Acciones</th>
			</tr>
		</thead>
		<tbody>
			{#each wrestlers as wrestler}
				<tr>
					<td>
						<button type="button" class="btn btn-danger" on:click={removeWrestler(wrestler)}>
							<Icon icon="trash" />
						</button>
					</td>
					<td class="image-column">
						<img
							width="50"
							height="50"
							src={wrestler.image}
							alt={wrestler.name}
							use:errorimage={'/vacant.webp'}
						/>
					</td>
					<td class="name-column">
						<input
							type="text"
							name="wrestler[name][]"
							value={wrestler.name}
							placeholder="Nombre de luchador"
							required
						/>
					</td>
					<td class="overall-column">
						<input
							type="number"
							name="wrestler[overall][]"
							min="0"
							max="120"
							value={wrestler.overall}
							placeholder="Media de luchador"
							required
						/>
					</td>
					<td class="brand-column">
						<select
							name="wrestler[brand][]"
							value={'raw'}
							placeholder="Brand del luchador"
							required
						>
							{#each Object.values(brands) as brand}
								<option value={brand.name}>{brand.title}</option>
							{/each}
						</select>
					</td>
					<td class="finisher-column">
						<input
							type="text"
							name="wrestler[finisher][]"
							value=""
							placeholder="Finisher de luchador"
							required
						/>
					</td>
					<td class="status-column">
						<select
							name="wrestler[status][]"
							value={'active'}
							placeholder="Estado del luchador"
							required
						>
							{#each WrestlerConstants.statuses as status}
								<option value={status.value}>{status.label}</option>
							{/each}
						</select>
					</td>
					<td class="gender-column">
						<select
							name="wrestler[gender][]"
							value={'m'}
							placeholder="Género del luchador"
							required
						>
							<option value="m">Hombre</option>
							<option value="f">Mujer</option>
						</select>
					</td>
					<td>
						<button type="button" class="btn btn-danger" on:click={removeWrestler(wrestler)}>
							<Icon icon="trash" />
						</button>
					</td>
				</tr>
			{/each}
		</tbody>

		<tfoot>
			<tr>
				<td>
					<button type="button" class="btn btn-info" on:click={addNewWrestlerItem}>
						<Icon icon="plus" />
					</button>
				</td>
				<td colspan="8">
					<p>Hay {wrestlers.length} luchadores en la lista</p>
				</td>
			</tr>
		</tfoot>
	</table>
</div>

<style>
	table tbody tr td.overall-column {
		min-width: 80px;
	}
	table tbody tr td.name-column {
		min-width: 150px;
	}
	table tbody tr td.brand-column {
		min-width: 90px;
	}
	table tbody tr td.finisher-column,
	table tbody tr td.status-column,
	table tbody tr td.gender-column {
		min-width: 120px;
	}
</style>
