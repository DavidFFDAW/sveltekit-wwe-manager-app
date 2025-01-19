<script lang="ts">
	export let url: string;
</script>

<aside class="admin-sidebar sidebar shown flex column gap" data-url={url}>
	<div class="dashboard">
		<a href="/admin" class="block w1 flex center acenter">
			<img src="/icons/versatile.png" alt="logo" width="144" height="144" />
		</a>
	</div>

	<div class="w1 links-container-block flex center">
		<ul class="w1 flex column gap-smaller">
			<li>
				<a href="/">Home</a>
			</li>
			<li class:active={url === '/admin'}>
				<a href="/admin">Dashboard</a>
			</li>
			<li class:active={url.startsWith('/admin/wrestlers')}>
				<a href="/admin/wrestlers">Luchadores</a>
			</li>
			<li class:active={url.startsWith('/admin/ppvs')}>
				<a href="/admin/ppvs">PPVs</a>
			</li>
		</ul>
	</div>
</aside>

<style>
	.links-container-block {
		padding: 0 20px;
	}
	.links-container-block li {
		width: 100%;
	}

	.links-container-block a {
		display: block;
		font-size: 16px;
		color: #fff;
		cursor: pointer;
		padding: 6px 20px;
		border-radius: 10px;
		font-family: 'dreadnotus';
	}

	.links-container-block li.active a,
	.links-container-block a:hover {
		background: #c91727;
		background: linear-gradient(140deg, #c91727, #1f1f1f);
	}
</style>
