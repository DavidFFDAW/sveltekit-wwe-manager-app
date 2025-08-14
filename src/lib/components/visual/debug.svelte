<script>
	export let datas = {};
</script>

<pre class="dev">{JSON.stringify(datas, null, 4)}</pre>

<style>
	pre.dev {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 9999;
		overflow: auto;
		color: greenyellow;
		background: #001722;
		font-family: monospace;
	}
</style>
