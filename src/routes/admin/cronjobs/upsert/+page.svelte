<script lang="ts">
	import Box from '$lib/components/box/box.svelte';
	import AsyncForm from '$lib/components/forms/async-form.svelte';
	import Input from '$lib/components/forms/inputs/input.svelte';
	import ToggleInput from '$lib/components/forms/inputs/toggle-input.svelte';
	import PageWrapper from '$lib/components/page-wrapper/page-wrapper.svelte';
	import type { Cronjobs } from '@prisma/client';

	export let cronjob: Cronjobs = {} as Cronjobs;
	const isUpdate = Boolean(cronjob.id);
</script>

<PageWrapper page="admin-cronjobs-upsert">
	<h1 class="admin-cronjobs-title">{isUpdate ? 'Actualizar' : 'Crear'} cronjob</h1>

	<AsyncForm method="post" buttonText="Guardar cronjob" redirect="/admin/cronjobs">
		<div class="grid two-column-grid gap-medium responsive">
			<Box title="Datos requeridos" icon="info-square">
				<Input
					type="text"
					name="name"
					label="Nombre"
					placeholder="Nombre del cronjob"
					bind:value={cronjob.name}
					maxLength={50}
					required={true}
				/>
				<Input
					type="text"
					name="url"
					label="URL"
					placeholder="URL de ejecución del cronjob"
					bind:value={cronjob.url}
					maxLength={255}
					required={true}
				/>
			</Box>

			<Box title="Datos opcionales" icon="info-square">
				<Input
					type="text"
					name="description"
					label="Descripcion"
					placeholder="Descripción del cronjob"
					bind:value={cronjob.description}
					maxLength={255}
				/>

				<select name="frequency" bind:value={cronjob.frequency}>
					<option value="" disabled selected>Selecciona la frecuencia</option>
					<option value="daily">Diario</option>
					<option value="weekly">Semanal</option>
					<option value="monthly">Mensual</option>
					<option value="yearly">Anual</option>
					<option value="hourly">Cada hora</option>
				</select>

				<ToggleInput name="active" label="Estado del cronjob" checked={cronjob.active} />
			</Box>
		</div>
	</AsyncForm>
</PageWrapper>
