<script lang="ts">
	import ActionsButton from '$lib/components/buttons/grouped-actions/actions-button.svelte';
	import ActionsLink from '$lib/components/buttons/grouped-actions/actions-link.svelte';
	import GroupedActions from '$lib/components/buttons/grouped-actions/grouped-actions.svelte';
	import type { Championship } from '@prisma/client';
	export let championship: Championship;
</script>

<GroupedActions text="Acciones" position="right" item={true} updateId={championship.id}>
	<ActionsLink icon="plus-circle" href={`/admin/championships/create`} color="info">
		Nuevo campeonato
	</ActionsLink>

	<ActionsLink icon="pencil" href={`/admin/championships/update/${championship.id}`} color="warn">
		Editar campeonato
	</ActionsLink>

	<ActionsButton
		action={'toggleActive'}
		method="post"
		icon={championship.active ? 'eye-slash' : 'eye'}
		confirm={true}
	>
		{championship.active ? 'Desactivar' : 'Activar'} campeonato
	</ActionsButton>
</GroupedActions>
