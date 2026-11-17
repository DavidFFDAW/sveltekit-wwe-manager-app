<script>
	let { datas, full = true } = $props();
</script>

<pre class="dev" class:full>
	{JSON.stringify(datas, null, 4)}
</pre>

<style>
	pre.dev {
		color: greenyellow;
		background: #001722;
		font-family: monospace;
		padding: 1rem;
		border-radius: 8px;
		border: 1px solid greenyellow;
		overflow: auto;
		opacity: 0.8;
	}

	pre.dev.full {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 9999;
	}
</style>
