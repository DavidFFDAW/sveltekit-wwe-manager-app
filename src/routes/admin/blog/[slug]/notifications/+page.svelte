<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<h1>Notificaciones</h1>
<p>{data.slug}</p>

<form action="" method="post">
	<button type="submit" name="preview" value="true" class="btn cta">Enviar vista previa</button>
</form>
