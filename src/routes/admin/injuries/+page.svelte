<script lang="ts">
	import ButtonCreate from '$lib/components/buttons/button-create.svelte';
	import { Utils } from '$lib/utils/general.utils';
	let { data } = $props();
</script>

<div class="w1 page-section">
	<header class="page-header">
		<h1>Lesiones</h1>
	</header>

	<div class="w1 ww-injury-list">
		{#each data.injuries as injury}
			<div class="ww-injury-item box">
				<div class="ww-injury-image-container">
					<img
						width="40"
						class="ww-injury-image"
						src={injury.Wrestler.image_name}
						alt={injury.Wrestler.name}
					/>
				</div>

				<div class="ww-injury-info">
					<h2 class="ww-injury-wrestler-name">{injury.Wrestler.name}</h2>
					<p class="ww-injury-name">Lesión: {injury.injury}</p>
					<p class="ww-injury-severity">Severidad: {injury.severity}</p>
					<p class="ww-injury-dates">
						Fechas: {Utils.toShortDate(injury.start_date)} -{' '}
						{Utils.toShortDate(injury.end_date)}
					</p>
					<a
						class="ww-injury-edit-link btn small warning icon"
						href={`/admin/injuries/upsert?id=${injury.id}`}
					>
						<i class="bi bi-pencil"></i>
						<span>Editar</span>
					</a>
				</div>
			</div>
		{/each}
	</div>

	<ButtonCreate endpoint="/injuries/upsert" />
</div>

<style>
	.ww-injury-list {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 1rem;
	}
</style>
