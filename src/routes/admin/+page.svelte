<script>
	import PageWrapper from '$lib/components/page-wrapper/page-wrapper.svelte';
</script>

<PageWrapper page="dashboard">
	<div class="admin-page-wrapper admin-dashboard">
		<h1>Dashboard</h1>
		<nav class="admin-dashboard-page-navigation down">
			<ul class="admin-dashboard-list" role="list">
				<li class="w1">
					<a href="/admin/wrestlers">Luchadores</a>
				</li>
				<li class="w1">
					<a href="/admin/ppvs">PPVs</a>
				</li>
			</ul>
		</nav>
	</div>
</PageWrapper>

<style>
	ul.admin-dashboard-list {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		place-items: center;
		gap: 20px;
	}

	ul.admin-dashboard-list li a {
		display: block;
		width: 100%;
		min-height: 250px;
		color: #fff;
		text-decoration: none;
		background-color: rgba(0, 0, 0, 0.5);
		background-position: center;
		background-size: cover;
		background-repeat: no-repeat;
		padding: 10px;
		border-radius: 4px;
	}
</style>
