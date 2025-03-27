<script lang="ts">
	import ButtonCreate from '$lib/components/buttons/button-create.svelte';
	import ActionsAsync from '$lib/components/buttons/grouped-actions/actions-async.svelte';
	import GroupedActions from '$lib/components/buttons/grouped-actions/grouped-actions.svelte';
	import PpvList from './ppv-list.svelte';
	// import Calendar from './calendar.svelte';
	export let data;
</script>

<!-- <div class="w1">
	<Calendar ppvs={data.ppvs} />
</div> -->

<div class="ppvs-inner-list">
	<div class="w1 flex end">
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
	</div>

	<div class="title">
		<h2>PPVs activos</h2>
		<PpvList ppvs={data.ppvs.filter((ppv) => ppv.active)} />
	</div>

	<div class="title down">
		<h2>PPVs inactivos</h2>
		<PpvList ppvs={data.ppvs.filter((ppv) => !ppv.active)} />
	</div>

	<ButtonCreate endpoint="/ppvs/create" />
</div>
