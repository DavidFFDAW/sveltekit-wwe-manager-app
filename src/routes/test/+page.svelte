<script>
	import HttpButton from '$lib/components/buttons/http-button.svelte';
	import AsyncForm from '$lib/components/forms/async-form.svelte';
	import ToggleInput from '$lib/components/forms/inputs/toggle-input.svelte';
	let checked = false;
</script>

<AsyncForm
	buttonText={'Actualizar campeonato'}
	updateId={6464612731}
	redirect="/admin/championships"
>
	<ToggleInput label="Tag Team" name="tag_team" bind:checked />
</AsyncForm>

<HttpButton href="/api/reigns/update-days/current" icon="refresh">Actualizar días</HttpButton>
