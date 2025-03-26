<script lang="ts">
	import PageWrapper from '$lib/components/page-wrapper/page-wrapper.svelte';
	import type { PPV } from '@prisma/client';
	import PpvCounter from './ppv-counter.svelte';
	export let data: { nextPpv: PPV };
</script>

<PageWrapper page="dashboard">
	<div class="admin-page-wrapper admin-dashboard">
		{#if data.nextPpv}
			<header class="next-ppv-date-wrapper flex gap-medium ignore-main-padding">
				<PpvCounter finalDate={data.nextPpv.game_date as Date} ppv={data.nextPpv} />
			</header>
		{/if}
		<div class="down">
			<h1>Dashboard</h1>
			<nav class="admin-dashboard-page-navigation down" style="margin-top: 50px;">
				<ul class="grid three-column-grid gap-20 admin-dashboard-list responsive" role="list">
					<li class="w1 background">
						<a href="/admin/wrestlers">
							<span>Luchadores</span>
							<img
								src="https://davidfernandezdeveloper.es/2k/images/john-cena.webp"
								alt="se muestra a John Cena y al pasar por encima se hace más grande saliendo del recuadro"
								draggable="false"
								aria-hidden="true"
								loading="lazy"
							/>
						</a>
					</li>
					<li class="w1 background">
						<a href="/admin/blog">
							<span>Blog</span>
							<img
								src="https://davidfernandezdeveloper.es/2k/images/the-rock.webp"
								alt="se muestra a Roman Reigns y al pasar por encima se hace más grande saliendo del recuadro"
								draggable="false"
								aria-hidden="true"
								loading="lazy"
							/>
						</a>
					</li>
					<li class="w1 background">
						<a href="/admin/championship-reigns">
							<span>Cinturones</span>
							<img
								src="https://davidfernandezdeveloper.es/2k/images/randy-orton.webp"
								alt="se muestra a Ric Flair y al pasar por encima se hace más grande saliendo del recuadro"
								draggable="false"
								aria-hidden="true"
								loading="lazy"
							/>
						</a>
					</li>
					<li class="w1 background reverse">
						<a href="/admin/championship-reigns">
							<span>Reinados</span>
							<img
								src="https://davidfernandezdeveloper.es/2k/images/gunther.webp"
								alt="se muestra a Gunther y al pasar por encima se hace más grande saliendo del recuadro"
								draggable="false"
								aria-hidden="true"
								loading="lazy"
							/>
						</a>
					</li>
					<li class="w1 background reverse">
						<a href="/admin/teams">
							<span>Equipos</span>
							<img
								src="https://davidfernandezdeveloper.es/2k/images/bret-hart.webp"
								alt="se muestra a Bret Hart y al pasar por encima se hace más grande saliendo del recuadro"
								draggable="false"
								aria-hidden="true"
								loading="lazy"
							/>
						</a>
					</li>
					<li class="w1 background reverse">
						<a href="/admin/users">
							<span>Usuarios</span>
							<img
								src="https://davidfernandezdeveloper.es/2k/images/shawn-michaels.webp"
								alt="se muestra a Shawn Michaels y al pasar por encima se hace más grande saliendo del recuadro"
								draggable="false"
								aria-hidden="true"
								loading="lazy"
							/>
						</a>
					</li>
					<li class="w1 background">
						<a href="/admin/image-editor">
							<span>Editor de imagenes</span>
							<img
								src="https://davidfernandezdeveloper.es/2k/images/kurt-angle.webp"
								alt="se muestra a Kurt Angle y al pasar por encima se hace más grande saliendo del recuadro"
								draggable="false"
								aria-hidden="true"
								loading="lazy"
							/>
						</a>
					</li>
					<li class="w1 background ppv-item">
						<a href="/admin/ppvs">
							<span>Eventos y shows</span>
						</a>
					</li>
				</ul>
			</nav>
		</div>
	</div>
</PageWrapper>

<style>
	:root {
		/* --dashboard-item-bg: url('https://cdn.pixabay.com/photo/2016/11/18/22/58/stars-1837306_640.jpg'); */
		/* --dashboard-item-bg: url('https://cdn.pixabay.com/photo/2016/11/18/22/58/stars-1837306_640.jpg'); */
		--dashboard-item-bg: url('https://media.istockphoto.com/id/1665661357/vector/bright-stadium-lights-vector-design.jpg?s=612x612&w=0&k=20&c=fPARi4dhnmIQprMY4_EneLckTQBVfns1Z1dnwl7CbE8=');
	}
	ul.admin-dashboard-list {
		gap: 40px 20px;
	}
	ul.admin-dashboard-list li a {
		justify-content: center;
	}
	ul.admin-dashboard-list li {
		height: 200px;
		position: relative;
		border-radius: 8px;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
		background-color: #ffffff;
		background-image: var(--dashboard-item-bg);
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
	}
	ul.admin-dashboard-list li.ppv-item {
		background-image: url('https://www.wwe.com/f/styles/gallery_img_l/public/all/2024/01/131_RR_01272024GD_37295--a0647e43afa91c64976613f63e4c387c.jpg');
	}

	ul.admin-dashboard-list li a {
		padding: 1rem;
		display: flex;
		position: relative;
		width: 100%;
		height: 100%;
		align-items: flex-end;
		color: #ffffff;
		text-decoration: none;
		font-family: 'dreadnotus', sans-serif;
		text-transform: uppercase;
		font-size: 20px;
	}
	ul.admin-dashboard-list li a span {
		position: relative;
		z-index: 20;
		text-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
		display: block;
		background-color: rgba(0, 0, 0, 0.5);
		padding: 0.5rem 1rem;
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
		z-index: 1;
	}

	ul.admin-dashboard-list li:hover img {
		transform: scale(1.05);
	}
	ul.admin-dashboard-list li a span {
		position: relative;
		border-bottom: 4px solid transparent;
	}

	ul.admin-dashboard-list li a:hover span {
		border-bottom: 4px solid #c91727;
	}
	ul.admin-dashboard-list li a:hover span::after {
		width: 60px;
	}

	@media screen and (max-width: 1250px) {
		.admin-dashboard-list {
			grid-template-columns: repeat(2, 1fr);
		}
	}
	@media screen and (max-width: 768px) {
		.admin-dashboard-list {
			grid-template-columns: repeat(1, 1fr);
		}
		ul.admin-dashboard-list li:nth-child(odd) a {
			justify-content: flex-end;
			text-align: right;
		}

		ul.admin-dashboard-list li:nth-child(even) a {
			justify-content: flex-start;
		}

		ul.admin-dashboard-list li:nth-child(odd) a img {
			left: 0;
			object-position: left;
		}

		ul.admin-dashboard-list li:nth-child(even) a img {
			right: 0;
			object-position: left;
		}
		ul.admin-dashboard-list li img {
			width: 220px;
		}

		ul.admin-dashboard-list li a {
			font-size: 18px;
			align-items: flex-end;
		}
		ul.admin-dashboard-list li a::after {
			top: calc(100% - 20px);
		}

		.admin-dashboard-list {
			gap: 35px;
		}
	}
</style>
