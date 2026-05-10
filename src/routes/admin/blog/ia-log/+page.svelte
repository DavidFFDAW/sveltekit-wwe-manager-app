<script lang="ts">
	let { data } = $props();
</script>

<div class="page">
	<header class="page-header">
		<h1 class="page-title">Logs de IA</h1>
	</header>

	<a href="https://console.groq.com/settings/limits" class="btn button groq-button">
		Revisar rate limits de Groq
	</a>

	<form method="get" class="dates flex start acenter gap-5 dates-container overflow-horizontal">
		{#each data.ia.dates as date}
			<button
				class="btn btn-filter"
				type="submit"
				class:active={data.ia.currentDate == date.text}
				name="date"
				value={date.value}
			>
				{date.text}
			</button>
		{/each}
	</form>

	<table cellpadding="0" cellspacing="0" border="0" class="ia-list-table">
		<thead>
			<tr class="ia-list-header">
				<th>Fecha</th>
				<th>Modelo</th>
				<th>Tokens</th>
			</tr>
		</thead>
		<tbody>
			{#each data.ia.usage as log}
				<tr class="ia-list-item">
					<td>{log.text}</td>
					<td>{log.model}</td>
					<td>{log.tokens}</td>
				</tr>
			{/each}
		</tbody>
		<tfoot>
			<tr class="ia-list-footer">
				<td colspan="2"><small>Total tokens de este dia:</small></td>
				<td><strong>{data.ia.totalTokens}</strong></td>
			</tr>
		</tfoot>
	</table>

	<br />

	<pre>
        {JSON.stringify(data.ia.yearlyUsage, null, 5)}
    </pre>
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

	table.ia-list-table {
		width: 100%;
		border-collapse: collapse;
		margin-top: 20px;
	}
	table.ia-list-table tr {
		border-bottom: 1px solid #fff;
	}
</style>
