<script lang="ts">
	import ActionsAsync from '$lib/components/buttons/grouped-actions/actions-async.svelte';
	import ActionsButton from '$lib/components/buttons/grouped-actions/actions-button.svelte';
	import ActionsLink from '$lib/components/buttons/grouped-actions/actions-link.svelte';
	import GroupedActions from '$lib/components/buttons/grouped-actions/grouped-actions.svelte';
	import type { PPV } from '@prisma/client';
	export let ppv: PPV;
</script>

<GroupedActions text="Acciones" position="right" item={true} updateId={ppv.id}>
	<ActionsLink icon="plus-circle" href={`/admin/ppvs/create`} color="info">Nuevo PPV</ActionsLink>

	<ActionsLink icon="pencil" href={`/admin/ppvs/update/${ppv.id}`} color="warn">
		Editar PPV
	</ActionsLink>

	<ActionsButton
		action={'toggleActive'}
		method="post"
		icon={ppv.active ? 'toggle-on' : 'toggle-off'}
		color={ppv.active ? 'warn' : 'info'}
		confirm={false}
	>
		{ppv.active ? 'Desactivar' : 'Activar'} PPV
	</ActionsButton>

	<ActionsButton action={'deletePPV'} method="post" icon="trash" confirm={true} color="danger">
		Eliminar PPV
	</ActionsButton>
</GroupedActions>
