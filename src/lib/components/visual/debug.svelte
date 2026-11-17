<script>
	let { datas, full = true } = $props();
</script>

<pre class="dev" class:full>{JSON.stringify(datas, null, 4)}</pre>

<style>
	pre.dev {
		overflow: auto;
		color: greenyellow;
		background: #001722;
		font-family: monospace;
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
