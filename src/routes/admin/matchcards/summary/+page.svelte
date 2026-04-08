<script lang="ts">
	let { data } = $props();

	const copyToClipboard = () => {
		const content = document.querySelector('.copiable')?.textContent;
		navigator.clipboard.writeText(content || '').then(
			() => alert('Datos copiados al portapapeles'),
			() => alert('Error al copiar los datos')
		);
	};
</script>

<pre class="copiable">
	{JSON.stringify(data, null, 4)}
</pre>

<button class="btn small rounded cta" type="button" onclick={copyToClipboard}>
	<i class="bi bi-clipboard"></i>
	<span>Copiar</span>
</button>

<a
	class="btn rounded cta"
	href="https://chatgpt.com/g/g-p-67aaf80f33908191bb5ffab06d85b978-wwe/c/9b2d8a04-cd8a-4fb1-9e0f-f76bc23a0479"
	target="_blank"
	rel="noopener noreferrer"
>
	Recomendamos usar este enlace para pegar los datos del evento y generar el resumen.
</a>

<a href="/admin/blog/create" class="btn rounded cta">Crear un nuevo post</a>
