<script lang="ts">
	let { data } = $props();
</script>

<div class="page">
	<header class="page-header">
		<h1 class="page-title">Logs de IA</h1>
	</header>

	<a href="https://console.groq.com/docs/rate-limits" class="btn button groq-button"
		>Revisar rate limits de Groq
	</a>

	<div class="dates flex start acenter gap-5 dates-container overflow-horizontal">
		{#each data.ia.dates as date}
			<button class="btn btn-filter" type="button" class:active={data.ia.currentDate == date}
				>{date}</button
			>
		{/each}
	</div>

	<pre>
		{JSON.stringify(data.ia, null, 4)}
	</pre>

	<ul class="ia-list">
		<!-- {#each data.ia.list as log}
			<li class="ia-list-item flex column gap-smaller">
				<p>{log.id}</p>
				<p>{log.model}</p>
				<p>{log.request_id}</p>
				<p>{log.service}</p>
				<p>{log.status}</p>
				<p>{log.total_time}</p>
				<p>{log.total_tokens}</p>
				<p>{Utils.toLocaleDate(log.created_at)}</p>
			</li>
		{/each} -->
	</ul>
</div>

<style>
	.btn.groq-button {
		display: inline-block;
		color: #fff;
		background-color: #ff3e00;
		padding: 3px 20px;
		font-size: 0.85em;
		border-radius: 50px;
		text-decoration: none;
		font-weight: bold;
	}
</style>
