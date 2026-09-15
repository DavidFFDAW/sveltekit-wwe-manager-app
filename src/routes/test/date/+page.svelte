<script lang="ts">
	import DateInput from '$lib/components/forms/date/date-input.svelte';
	import Debug from '$lib/components/visual/debug.svelte';

	let { data } = $props();
	let entries: Record<string, any>[] = $state([]);

	const submit = (ev: Event) => {
		ev.preventDefault();
		const target = ev.target as HTMLFormElement;
		if (!(target instanceof HTMLFormElement)) return;

		const fields = new FormData(target);
		entries = Array.from(fields.entries()).map(([key, value]) => ({
			key,
			value
		}));
	};
</script>

<form onsubmit={submit}>
	<DateInput name="dt_start" label="Fecha" hasTime={true} />
	<button class="btn" type="submit">Enviar</button>

	{#if entries && entries.length > 0}
		<Debug datas={entries} />
	{/if}
</form>
