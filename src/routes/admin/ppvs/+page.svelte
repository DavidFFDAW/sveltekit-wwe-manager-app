<script lang="ts">
	import ButtonCreate from '$lib/components/buttons/button-create.svelte';
	import PpvList from './ppv-list.svelte';
	// import Calendar from './calendar.svelte';
	export let data;
</script>

<!-- <div class="w1">
	<Calendar ppvs={data.ppvs} />
</div> -->

<div class="ppvs-inner-list">
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
