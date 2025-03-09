<script lang="ts">
	import MainHeader from '$lib/components/headers/main-header.svelte';
	import PageWrapper from '$lib/components/page-wrapper/page-wrapper.svelte';
	import Subscribe from '$lib/components/push/subscribe.svelte';
</script>

<MainHeader
	height="450px"
	bgPosition="top"
	mobileBackground="https://www.usanetwork.com/sites/usablog/files/2023/06/wwe-undertaker-dream-match1.jpg"
/>
<PageWrapper page="home">
	<section class="home-content">
		<article class="w1 home-article">
			<a href="/blog" class="w1 block">
				<div class="w1 article-content flex gap-medium astart responsive reverse">
					<img
						src="https://wallpapers.com/images/hd/la-knight-wwe-raw-30-amrjgyjlp883yp9v.jpg"
						alt="La Knight"
					/>

					<div class="w1 text-content flex column gap-medium astart">
						<h2>Blog</h2>
						<p>
							En nuestro blog, llevamos la emoción del ring directamente a tu pantalla,
							manteniéndote informado de todos los eventos, resultados, rivalidades y cambios
							inesperados que suceden en el Modo Universo de WWE2K. <br /><br />Si eres de los que
							disfrutan siguiendo cada historia y cada reinado como si fueran reales, aquí
							encontrarás todo lo que necesitas para no perderte ni un solo detalle.
						</p>
					</div>
				</div>
			</a>
		</article>

		<article class="w1 home-article">
			<a href="/roster" class="w1 block">
				<div class="w1 article-content flex gap-medium astart responsive">
					<img
						src="https://i.ebayimg.com/images/g/k9wAAOSwlYxiTJ6Y/s-l1200.jpg"
						alt="Roman Reigns enlace a roster"
						class="unmasked unmask"
					/>

					<div class="w1 text-content flex column gap-medium astart">
						<h2>Roster</h2>
						<p>
							Explora la lista completa de luchadores de WWE, desde los más icónicos hasta los más
							recientes. Descubre los perfiles de los luchadores, sus habilidades, movimientos
							especiales y estadísticas. Revisa y analiza todos los luchadores que están disponibles
							en cada marca y todas las leyendas que podrán aparecer esporádicamente en tus eventos.
						</p>
					</div>
				</div>
			</a>
		</article>

		<article class="w1 home-article">
			<a href="/champions" class="w1 block">
				<div class="w1 article-content flex gap-medium astart responsive reverse">
					<img
						src="https://www.wrestlinginc.com/img/gallery/wwes-gunther-explains-differences-between-wrestling-chad-gable-and-the-miz/l-intro-1700422034.jpg"
						alt="Gunther enlace a campeones"
						class="unmasked unmask"
					/>

					<div class="w1 text-content flex column gap-medium astart">
						<h2>Campeones</h2>
						<p>
							Explora los reinados más legendarios y emocionantes de los luchadores en la historia
							del universo WWE. Descubre quiénes han dominado los campeonatos, superado sus límites
							y dejado una marca imborrable en el ring. Desde los campeones indiscutibles hasta los
							underdogs que sorprendieron al mundo, revive cada momento de gloria.
						</p>
					</div>
				</div>
			</a>
		</article>

		<article class="w1 home-article">
			<a href="/pages" class="w1 block">
				<div class="w1 article-content flex gap-medium astart responsive">
					<img
						src="https://www.wwe.com/f/styles/gallery_img_l/public/all/2024/01/131_RR_01272024GD_37295--a0647e43afa91c64976613f63e4c387c.jpg"
						alt="Royal Rumble enlace a eventos"
						class="unmasked unmask"
					/>

					<div class="w1 text-content flex column gap-medium astart">
						<h2>Eventos</h2>
						<p>
							Explora la lista de eventos anuales programados en el universo WWE, desde los más
							icónicos hasta los nuevos. Descubre los eventos especiales, los PPV y los shows
							semanales que se llevarán a cabo en el calendario
						</p>
					</div>
				</div>
			</a>
		</article>
	</section>
</PageWrapper>

<style>
	section.home-content {
		max-width: 1200px;
		margin: 0 auto;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		gap: 30px;
		padding-top: 30px;
	}

	section.home-content article.home-article {
		border-radius: 10px;
		overflow: hidden;
		border: 1px solid rgba(0, 0, 0, 0.1);
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
	}

	section.home-content article.home-article h2 {
		position: relative;
		font-size: 2rem;
		font-weight: 700;
		font-family: 'dreadnotus';
		text-transform: uppercase;
	}

	section.home-content article.home-article h2::after {
		content: '';
		position: absolute;
		bottom: -5px;
		left: 0;
		width: 50px;
		height: 5px;
		border-radius: 15px;
		background-color: var(--raw);
	}

	section.home-content article.home-article .article-content {
		width: 100%;
		height: 400px;
	}

	section.home-content article.home-article .article-content .text-content {
		padding: 15px 15px 15px 0;
		overflow: hidden;
	}
	section.home-content article.home-article .article-content.reverse .text-content {
		padding: 15px 0 15px 15px;
	}
	section.home-content article.home-article .article-content .text-content p {
		font-size: 1.2rem;
		line-height: 1.5;
	}

	section.home-content article.home-article .article-content img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		overflow: hidden;
	}
	section.home-content article.home-article .article-content img:hover {
		transform: scale(1.04);
	}

	@media screen and (max-width: 768px) {
		section.home-content {
			padding-top: 0;
		}
		section.home-content article.home-article .article-content {
			height: auto;
		}
		section.home-content article.home-article .article-content .text-content,
		section.home-content article.home-article .article-content.reverse .text-content {
			padding: 15px;
		}

		section.home-content article.home-article .article-content .text-content p {
			font-size: 15px;
		}
	}
</style>
