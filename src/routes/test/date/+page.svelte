<script lang="ts">
	import { Utils } from '$lib/utils/general.utils.js';
	import DateInput from '$lib/components/forms/date/date-input.svelte';
	import DateUtils from '$lib/utils/date.utils.js';

	const format = 'Y-m-d';
	let { data } = $props();
	const formatter = DateUtils.getFormatter();
	let entries: Record<string, any> = $state({});

	const td = new Date();
	let date: Date = $state(new Date());

	const submit = (ev: Event) => {
		ev.preventDefault();
		const target = ev.target as HTMLFormElement;
		if (!(target instanceof HTMLFormElement)) return;

		const fields = new FormData(target);
		entries = {
			date: fields.get('dt_start'),
			time: fields.get('dt_start_time')
		};

		const dt = entries.date;
		const timestamp = `${dt}T${entries.time}`;
		date = new Date(timestamp);
		console.log({ ev, target, fields, entries, dt, date, timestamp });
	};
</script>

<form onsubmit={submit}>
	<DateInput name="dt_start" label="Fecha" hasTime={true} value={DateUtils.format(td, 'Y-m-d')} />
	<button class="btn" type="submit">Enviar</button>

	{#if entries && 'date' in entries}
		<pre>
			{JSON.stringify(
				{
					date: date,
					iso: date.toISOString(),
					locale: DateUtils.format(date, 'Y-m-d H:i:s')
				},
				null,
				5
			)}
		</pre>
	{/if}
</form>
