<script>
	import PageWrapper from '$lib/components/page-wrapper/page-wrapper.svelte';
	const year = new Date().getFullYear();
	const webName = 'WWE 2K Universo';
	const contactEmail = 'davidferflo2@gmail.com';
</script>

<PageWrapper page={'legal-notice'}>
	<div class="legal-pages-container">
		<div class="container">
			<h1>Política de Privacidad</h1>
			<p>
				Esta Política de Privacidad describe cómo manejamos la información personal recopilada,
				utilizada y compartida cuando visitas nuestra web dedicada al roster del modo universo de la
				saga de juegos WWE2K y a nuestro blog.
			</p>

			<h2>1. Información que recopilamos</h2>
			<p>
				No recopilamos información personal directamente. Sin embargo, utilizamos una cookie para
				almacenar el token de sesión cuando los usuarios inician sesión en la web.
			</p>

			<h2>2. Uso de cookies</h2>
			<p>
				Utilizamos una única cookie para gestionar la sesión del usuario en nuestra web. Esta cookie
				contiene un token de sesión que permite a los usuarios autenticarse y acceder a las
				funciones de la web, como ver el listado de luchadores del roster o comentar en el blog.
			</p>
			<p>
				La cookie se almacena en el dispositivo del usuario y expira automáticamente al cerrar la
				sesión o después de un período determinado de inactividad.
			</p>

			<h2>3. Uso de la información</h2>
			<p>La información que recopilamos mediante la cookie de sesión se utiliza únicamente para:</p>
			<ul>
				<li>Gestionar la autenticación del usuario.</li>
				<li>Permitir a los usuarios acceder a las funcionalidades de la web.</li>
				<li>Proporcionar una experiencia personalizada basada en la sesión del usuario.</li>
			</ul>

			<h2>4. Compartir la información</h2>
			<p>
				No compartimos la información almacenada en la cookie con terceros, salvo que sea requerido
				por la ley o para proteger nuestros derechos.
			</p>

			<h2>5. Seguridad</h2>
			<p>
				Tomamos medidas razonables para proteger la información almacenada en la cookie de accesos
				no autorizados y de pérdidas o modificaciones.
			</p>

			<h2>6. Derechos del usuario</h2>
			<p>Como usuario, tienes derecho a:</p>
			<ul>
				<li>Solicitar la eliminación de la cookie de tu dispositivo.</li>
				<li>Consultar y revisar la política de cookies en cualquier momento.</li>
			</ul>

			<h2>7. Cambios a esta Política de Privacidad</h2>
			<p>
				Podemos actualizar esta Política de Privacidad de vez en cuando para reflejar cambios en
				nuestras prácticas o por otras razones operativas, legales o reglamentarias.
			</p>

			<h2>8. Contacto</h2>
			<p>
				Si tienes alguna pregunta sobre esta Política de Privacidad, puedes ponerte en contacto con
				nosotros en {contactEmail}.
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
