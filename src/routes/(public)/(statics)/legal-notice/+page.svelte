<script>
	import Seo from '$lib/components/seo/seo.svelte';
	import PageWrapper from '$lib/components/page-wrapper/page-wrapper.svelte';
</script>

<Seo title="Aviso Legal" description="Aviso legal de la aplicacion" />

<PageWrapper page={'legal-notice'}>
	<div class="legal-pages-container">
		<div class="container">
			<h1>Aviso Legal</h1>
			<p>
				Este Aviso Legal regula el uso del sitio web WWE 2k Manager (en adelante, "el sitio web“).
				Al acceder y utilizar este sitio web, aceptas los términos y condiciones aquí establecidos.
			</p>
			<h2>1. Titularidad del sitio web</h2>
			<p>
				El sitio web es propiedad de David Fernández Flores. Puedes contactarnos en
				davidferflo2@gmail.com.
			</p>
			<h2>2. Uso del sitio web</h2>
			<p>
				El usuario se compromete a utilizar el sitio web de manera conforme a la ley, la moral y el
				orden público, y a no realizar actividades ilícitas, ilegales o contrarias a los derechos de
				terceros.
			</p>
			<h2>3. Responsabilidad</h2>
			<p>
				No nos hacemos responsables de los daños y perjuicios derivados del acceso o uso del sitio
				web, incluidos los producidos en sistemas informáticos o los causados por virus.
			</p>
			<h2>4. Enlaces a terceros</h2>
			<p>
				El sitio web puede contener enlaces a sitios web de terceros. No nos responsabilizamos del
				contenido, políticas de privacidad o prácticas de dichos sitios web.
			</p>
			<h2>5. Legislación aplicable y jurisdicción</h2>
			<p>
				Este Aviso Legal se rige por la legislación española. Para cualquier controversia que pueda
				surgir del acceso o uso del sitio web, las partes se someten a los juzgados y tribunales de
				España.
			</p>
			<div class="footer">
				<p>© {new Date().getFullYear()} WWE 2k Manager. Todos los derechos reservados.</p>
			</div>
		</div>
	</div>
</PageWrapper>
