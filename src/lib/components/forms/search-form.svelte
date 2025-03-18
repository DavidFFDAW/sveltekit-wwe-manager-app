<script lang="ts">
	import { page } from '$app/state';
	import Box from '../box/box.svelte';

	export let action: string = '';
</script>

<Box title="Buscador" icon="search">
	<form {action} method="get" class="w1 flex column gap-smaller">
		<slot />

		<div class="w1 flex end">
			<a type="reset" href={page.route.id} class="btn secondary">Limpiar</a>
			<button type="submit" class="btn cta">Buscar</button>
		</div>
	</form>
</Box>
