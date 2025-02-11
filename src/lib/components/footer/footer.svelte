<footer class="w1 footer public-footer footer-block flex start gap-small acenter responsive">
	<div class="footer-image-block">
		<a href="/"><img width="144" height="144" src="/icons/versatile.png" alt="logo" /></a>
	</div>
	<div class="w1 footer-items-container flex evenly gap astart responsive">
		<div class="footer-content-item footer-item">
			<p class="footer-title">Páginas legales</p>
			<ul class="footer-pages-list list-style-none">
				<li class="footer-list-item">
					<a class="footer-link" href="/legal-notice">Aviso legal</a>
				</li>
				<li class="footer-list-item">
					<a class="footer-link" href="/privacy">Política de privacidad</a>
				</li>
				<li class="footer-list-item">
					<a class="footer-link" href="/terms">Términos y condiciones</a>
				</li>
				<li class="footer-list-item">
					<a class="footer-link" href="/cookies">Política de cookies</a>
				</li>
			</ul>
		</div>
		<div class="footer-content-item footer-item">
			<p class="footer-title">Páginas de interés</p>
			<ul class="footer-pages-list list-style-none">
				<li class="footer-list-item">
					<a class="footer-link" href="/contact">Contacto</a>
				</li>
				<li class="footer-list-item">
					<a class="footer-link" href="/about">Sobre nosotros</a>
				</li>
				<!-- <li class="footer-list-item">
					<a class="footer-link" href="/pages/champions">Campeones</a>
				</li> -->
				<li class="footer-list-item"><a class="footer-link" href="/blog">Blog</a></li>
			</ul>
		</div>
		<div class="footer-content-item footer-item">
			<p class="footer-title">Páginas relevantes</p>
			<ul class="footer-pages-list list-style-none">
				<li class="footer-list-item">
					<a class="footer-link" href="/roster">Roster</a>
				</li>
				<li class="footer-list-item">
					<!-- <a class="footer-link" href="/pages/ranking">Ranking</a> -->
					<a class="footer-link" href="/champions">Campeones</a>
				</li>
				<!-- <li class="footer-list-item">
					<a class="footer-link" href="/pages/historic">Histórico de campeones</a>
				</li> -->
				<!-- <li class="footer-list-item"><a class="footer-link" href="/twitter">Twitter</a></li> -->
			</ul>
		</div>
		<div class="footer-content-item footer-item">
			<p class="footer-title">Contacto</p>
			<ul class="footer-pages-list list-style-none">
				<li class="footer-list-item">
					<a class="footer-link" href="/contact">Formulario de contacto</a>
				</li>
				<li class="footer-list-item"><a class="footer-link" href="/admin">Administración</a></li>
			</ul>
		</div>
	</div>
</footer>

<style>
	footer.footer.public-footer.footer-block {
		margin-top: 30px;
		width: 100%;
		padding: 8px 20px;
		min-height: 150px;
		background-color: #111010;
		color: #fff;
	}

	footer.footer.public-footer.footer-block .footer-title {
		position: relative;
		font-size: 18px;
		font-weight: 700;
		text-transform: uppercase;
		margin-bottom: 6px;
	}

	footer.footer.public-footer.footer-block .footer-title:after {
		content: '';
		position: absolute;
		display: block;
		width: 80%;
		height: 1px;
		background-color: #f44336;
	}

	footer.footer.public-footer.footer-block .footer-pages-list {
		padding-left: 15px;
	}

	footer.footer.public-footer.footer-block .footer-pages-list .footer-list-item .footer-link {
		color: #fff;
		text-transform: uppercase;
		font-size: 14px;
		font-weight: 500;
		text-decoration: none;
	}

	footer.footer.public-footer.footer-block .footer-pages-list .footer-list-item .footer-link:hover {
		color: #f44336;
	}

	@media only screen and (max-width: 768px) {
		footer.footer.public-footer.footer-block .footer-items-container {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			grid-gap: 50px 20px;
			gap: 50px 20px;
			place-content: start;
			align-items: start;
		}
	}
</style>
