<script lang="ts">
	import { enhance } from '$app/forms';
	import DateViewer from './date-viewer.svelte';

	let { data, form }: any = $props();
	const frontDate = new Date();
</script>

<div class="dates-container">
	<form use:enhance method="post">
		<input type="date" name="date" value={frontDate.toISOString().split('T')[0]} />
		<button type="submit">Enviar</button>
	</form>

	{#if form}
		<pre>{JSON.stringify(form, null, 5)}</pre>
		<DateViewer date={form.date} title="Fecha desde el formulario" />
	{/if}

	<DateViewer date={data.date} title="Fecha desde el servidor" />
	<DateViewer date={data.madridDate} title="Fecha convertida servidor" />
	<DateViewer date={frontDate} title="Fecha del cliente frontend" />
</div>

<style>
	.dates-container {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}
</style>
