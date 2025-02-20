<script lang="ts">
	import { errorimage } from '$lib/actions/error.image';
	import Box from '$lib/components/box/box.svelte';
	import AsyncForm from '$lib/components/forms/async-form.svelte';
	import PageWrapper from '$lib/components/page-wrapper/page-wrapper.svelte';
	import { ReignUtils } from '$lib/utils/reign.utils';
	import UpsertChampionship from '../../upsert-championship.svelte';
	export let data;
</script>

<PageWrapper page="admin-championship-update-page">
	{#if data.championship}
		<AsyncForm
			buttonText={'Actualizar campeonato'}
			updateId={data.championship.id}
			redirect="/admin/championships"
		>
			<div class="grid grid-two-column gap-smaller responsive">
				<UpsertChampionship championshipDatas={data.championship} />

				{#if data.championship?.ChampionshipReign && data.championship.ChampionshipReign.length > 0}
					<Box title="Reinados anteriores" icon="trophy">
						<div class="old-reigns-block">
							{#each data.championship.ChampionshipReign as reign}
								<a
									href="/admin/championship-reigns/update/{reign.id}"
									class="w1 flex gap-smaller old-reign-item astart"
									class:active={reign.current}
								>
									<div class="flex column center acenter gap-0 old-reign-item-inner">
										<img
											use:errorimage={'/vacant.webp'}
											width="60"
											src={reign.Wrestler.image_name}
											alt={reign.Wrestler.name}
										/>
										<p class="date-won">{reign.won_date.toLocaleDateString()}</p>
									</div>

									<div class="w1 flex column gap-5 astart">
										<h4 class="tcenter reign-wrestler-name">
											{ReignUtils.getWrestlerOrTeamName(reign as any)}
										</h4>
										<p class="reign-days">{ReignUtils.getDaysAndMonths(reign.days)}</p>
									</div>
								</a>
							{/each}
						</div>
					</Box>
				{/if}
			</div>
		</AsyncForm>
	{/if}
</PageWrapper>

<style>
	.old-reigns-block {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 10px;
		max-height: 650px;
		padding: 5px 10px;
		overflow-y: auto;
	}

	.old-reigns-block .old-reign-item {
		padding: 8px;
		border-radius: 10px;
		background-color: #fff;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
	}

	.old-reigns-block .old-reign-item.active {
		border: 2px solid var(--imgur);
	}

	.old-reigns-block .old-reign-item .old-reign-item-inner {
		background-color: #eee;
		padding: 5px;
		border-radius: 14px;
	}

	@media only screen and (max-width: 768px) {
		.old-reigns-block {
			max-height: 420px;
		}
	}
</style>
