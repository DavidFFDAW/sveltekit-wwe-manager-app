<script lang="ts">
	import ActionsButton from '$lib/components/buttons/grouped-actions/actions-button.svelte';
	import ActionsLink from '$lib/components/buttons/grouped-actions/actions-link.svelte';
	import GroupedActions from '$lib/components/buttons/grouped-actions/grouped-actions.svelte';
	import type { Team } from '@prisma/client';

	export let team: Team & { ChampionshipReign: any[] };
</script>

<GroupedActions updateId={team.id} item={true} position="right" text="Acciones">
	<ActionsLink href={`/admin/teams/update/${team.id}`} icon="pencil" color="warn">
		Editar
	</ActionsLink>

	<ActionsButton
		action={'toggleVisibility'}
		method="post"
		icon={team.active ? 'eye-slash' : 'eye'}
		color={team.active ? 'warn' : 'info'}
		confirm={false}
	>
		{team.active ? 'Desactivar' : 'Activar'} equipo
	</ActionsButton>

	{#if team.ChampionshipReign.length <= 0}
		<ActionsButton action={'deleteTeam'} method="post" icon="trash" color="danger" confirm={true}>
			Eliminar equipo
		</ActionsButton>
	{/if}
</GroupedActions>
