<script lang="ts">
	let { date, title }: { title: string; date: Date } = $props();
</script>

<div class="date-container" data-testid="date-container" data-date={date.toISOString()}>
	<h2>{title}</h2>
	<div class="date-datas">
		<span class="data-label">ToString:</span>
		<span class="data-value">{date.toString()}</span>
	</div>
	<div class="date-datas">
		<span class="data-label">toLocaleString:</span>
		<span class="data-value">{date.toLocaleString('es-ES', { timeZone: 'Europe/Madrid' })}</span>
	</div>
	<div class="date-datas">
		<span class="data-label">ISO:</span>
		<span class="data-value">{date.toISOString()}</span>
	</div>
	<div class="date-datas">
		<span class="data-label">UTC:</span>
		<span class="data-value">{date.toUTCString()}</span>
	</div>
	<div class="date-datas">
		<span class="data-label">DateString:</span>
		<span class="data-value">{date.toDateString()}</span>
	</div>
	<div class="date-datas">
		<span class="data-label">toJSON:</span>
		<span class="data-value">{date.toJSON()}</span>
	</div>
	<div class="date-datas">
		<span class="data-label">JSON:</span>
		<span class="data-value">{JSON.stringify(date)}</span>
	</div>
	<div class="date-datas">
		<span class="data-label">TimeString:</span>
		<span class="data-value">{date.toTimeString()}</span>
	</div>
	<div class="date-datas">
		<span class="data-label">toLocaleDateString:</span>
		<span class="data-value">{date.toLocaleDateString()}</span>
	</div>
	<div class="date-datas">
		<span class="data-label">toLocaleTimeString:</span>
		<span class="data-value">{date.toLocaleTimeString()}</span>
	</div>
</div>

<style>
	.date-container {
		background-color: #fff;
		border: 1px solid #ccc;
		border-radius: 0.5rem;
		padding: 20px;
	}
	.date-datas {
		display: flex;
		flex-direction: row;
		gap: 10px;
		margin-bottom: 5px;
	}
	.data-label {
		font-weight: bold;
	}
</style>
