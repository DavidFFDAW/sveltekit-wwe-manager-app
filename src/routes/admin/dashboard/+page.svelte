<script>
	import PageWrapper from '$lib/components/page-wrapper/page-wrapper.svelte';
</script>

<PageWrapper page="dashboard">
	<div class="admin-page-wrapper admin-dashboard">
		<h1>Dashboard</h1>
		<nav class="admin-dashboard-page-navigation down" style="margin-top: 50px;">
			<ul class="grid three-column-grid gap-20 admin-dashboard-list responsive" role="list">
				<li class="w1 background">
					<a href="/admin/wrestlers">
						Luchadores
						<img
							src="https://davidfernandezdeveloper.es/2k/images/john-cena.webp"
							alt="se muestra a John Cena y al pasar por encima se hace más grande saliendo del recuadro"
						/>
					</a>
				</li>
				<li class="w1 background reverse">
					<a href="/admin/blog">
						Blog
						<img
							src="https://davidfernandezdeveloper.es/2k/images/the-rock.webp"
							alt="se muestra a Roman Reigns y al pasar por encima se hace más grande saliendo del recuadro"
						/>
					</a>
				</li>
				<li class="w1 background">
					<a href="/admin/championship-reigns">
						Reinados
						<img
							src="https://davidfernandezdeveloper.es/2k/images/gunther.webp"
							alt="se muestra a Gunther y al pasar por encima se hace más grande saliendo del recuadro"
						/>
					</a>
				</li>
				<li class="w1 background reverse">
					<a href="/admin/ppvs">
						PPVs
						<img
							src="https://davidfernandezdeveloper.es/2k/images/shawn-michaels.webp"
							alt="se muestra a The Undertaker y al pasar por encima se hace más grande saliendo del recuadro"
						/>
					</a>
				</li>
				<li class="w1 background reverse">
					<a href="/admin/image-editor">
						Editor
						<img
							src="https://davidfernandezdeveloper.es/2k/images/kurt-angle.webp"
							alt="se muestra a Stone Cold y al pasar por encima se hace más grande saliendo del recuadro"
						/>
					</a>
				</li>
			</ul>
		</nav>
	</div>
</PageWrapper>

<style>
	:root {
		/* --dashboard-item-bg: url('https://cdn.pixabay.com/photo/2016/11/18/22/58/stars-1837306_640.jpg'); */
		--dashboard-item-bg: url('https://cdn.pixabay.com/photo/2016/11/18/22/58/stars-1837306_640.jpg');
	}
	ul.admin-dashboard-list li {
		height: 200px;
		position: relative;
		border-radius: 8px;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
		background-color: #ffffff;
		background-image: var(--dashboard-item-bg);
	}

	ul.admin-dashboard-list li a {
		padding: 1rem;
		display: flex;
		position: relative;
		width: 100%;
		height: 100%;
		align-items: center;
		color: #ffffff;
		text-decoration: none;
		font-family: 'dreadnotus', sans-serif;
		text-transform: uppercase;
		font-size: 28px;
	}

	ul.admin-dashboard-list li:nth-child(odd) a {
		justify-content: flex-end;
		text-align: right;
	}

	ul.admin-dashboard-list li:nth-child(even) a {
		justify-content: flex-start;
	}

	ul.admin-dashboard-list li img {
		position: absolute;
		bottom: 0;
		width: 238px;
		object-fit: cover;
		object-position: right;
		transition: transform 0.3s;
		transform-origin: bottom;
		border-radius: 0 0 8px 8px;
	}

	ul.admin-dashboard-list li:nth-child(odd) a img {
		left: 0;
		object-position: left;
	}

	ul.admin-dashboard-list li:nth-child(even) a img {
		right: 0;
		object-position: left;
	}

	ul.admin-dashboard-list li:hover img {
		transform: scale(1.1);
	}
	ul.admin-dashboard-list li a::after {
		content: '';
		position: absolute;
		top: calc(50% + 15px);
		width: 0;
		height: 4px;
		background-color: #bf9bf0;
		border-radius: 8px;
		transition: width 0.3s;
	}

	ul.admin-dashboard-list li a:hover::after {
		width: 60px;
	}

	@media screen and (max-width: 768px) {
		ul.admin-dashboard-list li a {
			font-size: 18px;
		}
	}
</style>
