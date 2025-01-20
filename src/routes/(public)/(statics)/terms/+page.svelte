<script>
	import PageWrapper from '$lib/components/page-wrapper/page-wrapper.svelte';
	const year = new Date().getFullYear();
	const webName = 'WWE 2K Universo';
	const contactEmail = 'davidferflo2@gmail.com';
</script>

<PageWrapper page={'legal-notice'}>
	<div class="legal-pages-container">
		<div class="container">
			<h1>Términos y Condiciones</h1>
			<p>
				Bienvenido a {webName}. Al acceder y utilizar este sitio web, aceptas cumplir con los
				siguientes términos y condiciones. Si no estás de acuerdo con alguna de las condiciones, te
				recomendamos que no utilices el sitio web.
			</p>

			<h2>1. Aceptación de los Términos</h2>
			<p>
				El acceso y uso del sitio web están sujetos a estos Términos y Condiciones y a las leyes
				aplicables. Al utilizar el sitio web, aceptas estos términos sin reservas.
			</p>

			<h2>2. Uso del Sitio Web</h2>
			<p>
				El sitio web está destinado a proporcionar información sobre el roster del modo universo de
				la saga de juegos WWE2K y publicar entradas en el blog. Aceptas usar el sitio web solo para
				fines legales y de acuerdo con las leyes aplicables.
			</p>
			<p>No está permitido:</p>
			<ul>
				<li>
					Realizar actividades que puedan dañar, sobrecargar o afectar negativamente al sitio web.
				</li>
				<li>Utilizar el sitio web para realizar actividades ilícitas o fraudulentas.</li>
				<li>Interferir con la seguridad o integridad del sitio web.</li>
			</ul>

			<h2>3. Propiedad Intelectual</h2>
			<p>
				Los contenidos del sitio web, incluidos textos, imágenes, gráficos y diseño, están
				protegidos por derechos de propiedad intelectual y son propiedad de {webName} o de sus licenciantes.
				No está permitido reproducir, distribuir, modificar o usar estos contenidos sin autorización
				previa.
			</p>

			<h2>4. Contenido del Usuario</h2>
			<p>
				Si envías contenido al sitio web (como comentarios en el blog), otorgas a {webName} una licencia
				mundial, no exclusiva, libre de royalties para utilizar, reproducir y mostrar dicho contenido.
			</p>
			<p>
				Te comprometes a que el contenido que envíes no infrinja derechos de terceros ni contenga
				material ilegal o dañino.
			</p>

			<h2>5. Exención de Responsabilidad</h2>
			<p>
				No garantizamos que el sitio web esté libre de errores, virus u otros elementos dañinos. El
				uso del sitio web es bajo tu propio riesgo. No nos hacemos responsables de cualquier daño
				derivado del uso del sitio web.
			</p>

			<h2>6. Modificaciones</h2>
			<p>
				Podemos actualizar estos Términos y Condiciones en cualquier momento. Los cambios entrarán
				en vigor al momento de su publicación en el sitio web. Es tu responsabilidad revisar
				periódicamente los términos.
			</p>

			<h2>7. Enlaces a Terceros</h2>
			<p>
				El sitio web puede contener enlaces a sitios web de terceros. No somos responsables del
				contenido ni de las prácticas de privacidad de estos sitios web. Recomendamos revisar sus
				políticas de privacidad.
			</p>

			<h2>8. Legislación Aplicable y Jurisdicción</h2>
			<p>
				Estos Términos y Condiciones se rigen por la legislación española. Cualquier controversia
				derivada del acceso o uso del sitio web será resuelta por los tribunales de España.
			</p>

			<div class="footer">
				<p>
					© {year}
					{webName}. Todos los derechos reservados.
				</p>
			</div>
		</div>
	</div>
</PageWrapper>
