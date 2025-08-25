<script lang="ts">
	const handleSubmit = (event: Event) => {
		const formData = new FormData(event.target as HTMLFormElement);
		for (const [key, value] of formData.entries()) {
			console.log(`${key}: ${value}`);
		}
	};
</script>

<form action="" method="post" on:submit|preventDefault={handleSubmit}>
	<input type="hidden" name="meme" value="some_value" />
	<button type="submit">Guardar</button>
</form>
