<script lang="ts">
	import Box from '$lib/components/box/box.svelte';
	import AsyncForm from '$lib/components/forms/async-form.svelte';
	import Input from '$lib/components/forms/inputs/input.svelte';
	import RadioList from '$lib/components/forms/inputs/radio-list.svelte';
	import ToggleInput from '$lib/components/forms/inputs/toggle-input.svelte';
	import PageWrapper from '$lib/components/page-wrapper/page-wrapper.svelte';
	import UpsertUsers from '../../upsert-users.svelte';

	export let data;
</script>

<PageWrapper page="admin-user-update">
	<AsyncForm buttonText={'Actualizar usuario'} updateId={data.user.id}>
		<UpsertUsers user={data.user} />
	</AsyncForm>
</PageWrapper>
