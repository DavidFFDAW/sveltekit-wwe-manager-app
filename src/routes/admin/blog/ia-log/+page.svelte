<script lang="ts">
	import { Utils } from '$lib/utils/general.utils.js';
	let { data } = $props();
</script>

<div class="page">
	<header class="page-header">
		<h1 class="page-title">Logs de IA</h1>
	</header>

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
