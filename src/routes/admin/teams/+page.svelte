<script>
	import { errorimage } from '$lib/actions/error.image';
	import AsyncButton from '$lib/components/buttons/async-button.svelte';
	import ActionsButton from '$lib/components/buttons/grouped-actions/actions-button.svelte';
	import ActionsLink from '$lib/components/buttons/grouped-actions/actions-link.svelte';
	import GroupedActions from '$lib/components/buttons/grouped-actions/grouped-actions.svelte';
	import PageWrapper from '$lib/components/page-wrapper/page-wrapper.svelte';

	export let data;
	const maximumScrollableItems = 2;
</script>

<PageWrapper page="admin-teams">
	<div class="w1 flex end">
		<AsyncButton
			url="/api/teams/gender/refresh"
			method="post"
			classes="btn cta"
			text="Comprobar géneros de equipos"
			icon="gender-ambiguous"
		/>
	</div>

	<div class="page-list-container">
		<ul class="grid grid-three-column gap-medium responsive">
			{#each data.teams as team}
				<li>
					<div class="block box relative team-box shadow {team.active ? 'active' : 'inactive'}">
						<div class="whole-content">
							<div class="images-slider">
								<div
									class="images-container"
									class:scrollable={team.WrestlerTeam.length > maximumScrollableItems}
								>
									{#each team.WrestlerTeam as wt}
										<img
											use:errorimage={'/vacant.webp'}
											src={wt.Wrestler.image_name}
											alt={wt.Wrestler.name}
										/>
									{/each}
								</div>
							</div>
							<div class="name-block w1 flex center acenter column nogap">
								<h3 class="w1 block tcenter">{team.name}</h3>
								{#if team.ChampionshipReign.length > 0}
									<small>Han tenido {team.ChampionshipReign.length} reinados como campeones</small>
								{/if}
							</div>
						</div>

						<div class="absolute top right">
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
									<ActionsButton
										action={'deleteTeam'}
										method="post"
										icon="trash"
										color="danger"
										confirm={true}
									>
										Eliminar equipo
									</ActionsButton>
								{/if}
							</GroupedActions>
						</div>
					</div>
				</li>
			{/each}
		</ul>
	</div>
</PageWrapper>

<style>
	.box.team-box.inactive .whole-content {
		opacity: 0.5;
		filter: grayscale(100%);
	}
	.images-slider {
		overflow: hidden;
		width: 100%;
		overflow-x: auto;
	}
	.images-container {
		display: flex;
		justify-content: center;
		align-items: flex-start;
	}
	.images-container.scrollable {
		justify-content: flex-start;
	}
	.images-container img {
		width: 150px;
		margin-right: 0.5rem;
	}

	.name-block {
		margin-top: 0.5rem;
		padding: 5px;
		border-top: 1px solid #ccc;
	}
</style>
