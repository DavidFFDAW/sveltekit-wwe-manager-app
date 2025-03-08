<script>
	import Seo from '$lib/components/seo/seo.svelte';
	import PageWrapper from '$lib/components/page-wrapper/page-wrapper.svelte';
	const webName = 'WWE 2K Universo';
	const contactEmail = 'davidferflo2@gmail.com';
</script>

<Seo title="Política de Cookies" description="Política de Cookies de WWE 2K Universo" />

<PageWrapper page={'legal-notice'}>
	<div class="legal-pages-container">
		<div class="container">
			<h1>Política de Cookies</h1>
			<p>
				En nuestro sitio web {webName} utilizamos cookies para mejorar la experiencia del usuario. A
				continuación, te explicamos qué son las cookies, qué tipo de cookies utilizamos y cómo puedes
				gestionarlas.
			</p>

			<h2>1. ¿Qué son las cookies?</h2>
			<p>
				Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando visitas
				un sitio web. Permiten al sitio web recordar tus acciones y preferencias (como el inicio de
				sesión) durante un período de tiempo.
			</p>

			<h2>2. Tipos de cookies que utilizamos</h2>
			<ul>
				<li>
					<strong>Cookies de sesión:</strong> Utilizamos una cookie de sesión para gestionar la autenticación
					de los usuarios. Esta cookie almacena un token de sesión que se utiliza para mantener la sesión
					activa mientras navegas por la web.
				</li>
			</ul>

			<h2>3. Cómo gestionar las cookies</h2>
			<p>
				Puedes gestionar las cookies a través de la configuración de tu navegador. Puedes permitir,
				bloquear o eliminar las cookies instaladas en tu dispositivo en cualquier momento. Sin
				embargo, ten en cuenta que si desactivas las cookies, es posible que algunas funciones de
				nuestro sitio web no funcionen correctamente.
			</p>

			<h2>4. Cambios en la Política de Cookies</h2>
			<p>
				Podemos actualizar esta Política de Cookies en cualquier momento. Te recomendamos que
				revises esta página periódicamente para estar al tanto de los cambios.
			</p>

			<h2>5. Contacto</h2>
			<p>
				Si tienes alguna pregunta sobre nuestra Política de Cookies, puedes ponerte en contacto con
				nosotros en {contactEmail}.
			</p>

			<div class="footer">
				<p>
					© {new Date().getFullYear()}
					{webName}. Todos los derechos reservados.
				</p>
			</div>
		</div>
	</div>
</PageWrapper>
