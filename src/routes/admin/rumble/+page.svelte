<script lang="ts">
	import Dialog from '$lib/components/dialog/dialog.svelte';
	import AsyncForm from '$lib/components/forms/async-form.svelte';
	import RadioList from '$lib/components/forms/inputs/radio-list.svelte';

	let { data } = $props();
	const currentYear = new Date().getFullYear();
	let showCreateRumbleForm = $state<boolean>(false);
	let rumbleType = $state<string>('m');
	let wrestlerList = $derived(
		data.wrestlers.filter((wrestler) => wrestler.sex.toLowerCase() === rumbleType)
	);
</script>

<div class="page">
	<header class="page-header">
		<h1>Royal Rumble</h1>
		<small>Administración de eventos Royal Rumble</small>
		<button class="btn icon info icon-gap-5" onclick={() => (showCreateRumbleForm = true)}>
			<i class="bi bi-plus-circle-fill"></i>
			Nuevo ganador
		</button>
	</header>
</div>

<section class="royal-rumble-page">
	{#if data.rumbles.length > 0}
		<ul class="rumble-winners-list">
			{#each data.rumbles as rumble}
				<li class="w1 item list-item wrestler-rumble-winner rumble-winner-item">
					<div class="wrestler-rumble-winner-info flex gap-10 acenter">
						<pre>
                            {JSON.stringify(rumble, null, 6)}
                        </pre>
					</div>
				</li>
			{/each}
		</ul>
	{:else}
		<h2>No hay ganadores de Royal Rumble registrados.</h2>
	{/if}
</section>

<Dialog bind:opened={showCreateRumbleForm} title="Nuevo ganador de Royal Rumble">
	<AsyncForm method="post" showButtons={false} reset={true}>
		<RadioList
			label="Tipo de Royal Rumble"
			name="rumbleType"
			bind:value={rumbleType}
			options={[
				{ label: 'Masculino', value: 'm' },
				{ label: 'Femenino', value: 'f' }
			]}
		/>

		<label>
			<span>Ganador</span>
			<select name="winner" required>
				<option value="" disabled selected>Selecciona un luchador</option>
				{#each wrestlerList as wrestler}
					<option value={wrestler.id}>{wrestler.name}</option>
				{/each}
			</select>
		</label>

		<label>
			<span>Año</span>
			<input type="number" name="year" min="1988" max={currentYear} value={currentYear} required />
		</label>

		<label>
			<span>Posición</span>
			<input type="number" name="position" min="1" max="30" value="25" required />
		</label>

		<button class="btn cta icon icon-gap-5" type="submit">
			<i class="bi bi-plus-circle-fill"></i>
			Crear ganador
		</button>
	</AsyncForm>
</Dialog>

<style>
	.page > * {
		margin: 50px 0;
	}
	.page > *:first-child {
		margin-top: 0;
	}
</style>
