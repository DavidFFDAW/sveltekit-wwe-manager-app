<script lang="ts">
	import Box from '$lib/components/box/box.svelte';
	import ButtonCreate from '$lib/components/buttons/button-create.svelte';
	import ActionsAsync from '$lib/components/buttons/grouped-actions/actions-async.svelte';
	import GroupedActions from '$lib/components/buttons/grouped-actions/grouped-actions.svelte';
	import Input from '$lib/components/forms/inputs/input.svelte';
	import RadioList from '$lib/components/forms/inputs/radio-list.svelte';
	import PpvList from './ppv-list.svelte';
	// import Calendar from './calendar.svelte';
	export let data;
</script>

<!-- <div class="w1">
	<Calendar ppvs={data.ppvs} />
</div> -->

<div class="ppvs-inner-list">
	<div class="w1 flex end gap-small">
		<GroupedActions text="Acciones de PPV" position="right" item={false}>
			<ActionsAsync
				href={'/api/ppv/year/refresh'}
				confirmate="Esta acción cambiará las fechas de todos los PPVs al año actual. ¿Estás seguro de que deseas continuar?"
				method="post"
				icon="calendar3"
				color="warn"
			>
				Cambiar fechas de PPVs a {new Date().getFullYear()}
			</ActionsAsync>
		</GroupedActions>

		<a href="/admin/ppvs/update/calendar" class="btn cta icon">
			<i class="bi bi-calendar-event"></i> Ir a panel de cambio masivo de fechas
		</a>
	</div>

	<header class="page-header down">
		<h1 class="dreadnotus title uppercase">PPVs</h1>
		<form action="" method="get">
			<Box icon="filter" title="Filtros">
				<Input label="Buscar por nombre" name="search" value={data.filters.search} />
				<RadioList
					label="Tipo"
					name="type"
					value={data.filters.type as string}
					options={[
						{ label: 'Todos', value: 'all' },
						{ label: 'Activos', value: 'active' },
						{ label: 'Inactivos', value: 'inactive' },
						{ label: 'Sin fecha asignada', value: 'no-date' },
						{ label: 'Por anunciar', value: 'to-be-announced' }
					]}
				/>

				<div class="w1 flex end">
					<button type="submit" class="btn cta icon">
						<i class="bi bi-funnel-fill"></i> Aplicar filtros
					</button>
				</div></Box
			>
		</form>
	</header>

	<section class="w1 ppv-list-container down">
		<PpvList ppvs={data.ppvs} />
	</section>

	<ButtonCreate endpoint="/ppvs/create" />
</div>
