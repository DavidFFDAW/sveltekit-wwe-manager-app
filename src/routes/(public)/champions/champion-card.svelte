<script lang="ts">
	import { errorimage } from '$lib/actions/error.image';
	import type { Championship, ChampionshipReign, Team, Wrestler } from '@prisma/client';
	import RosterCardName from './roster-card-name.svelte';

	export let reign: ChampionshipReign & { Wrestler: Wrestler } & { Championship: Championship } & {
		Team: Team;
	} & {
		Partner: Wrestler;
	} & { parsedDays: string };
</script>

<div class="w1 entire-roster-champion-card">
	<div class="w1 roster-card relative brand-{reign.Championship.brand?.toLowerCase()}">
		<div class="overlay-gradient"></div>
		<div class="roster-wrestler-brand">
			<!-- <BrandImage brand={reign.Championship.brand} /> -->
		</div>

		<div class="w1 h1 wrestlers-images-container relative">
			<img
				width={reign.Championship.tag ? 80 : 128}
				height={reign.Championship.tag ? 80 : 128}
				src={reign.Wrestler.image_name}
				use:errorimage={'/vacant.webp'}
				alt={reign.Wrestler.name}
				class="total-image roster-lazy-image image-container"
			/>
			{#if reign.Championship.tag && reign.partner}
				<img
					width={80}
					height={80}
					src={reign.Partner.image_name}
					use:errorimage={'/vacant.webp'}
					alt={reign.Partner.name}
					class="total-image roster-lazy-image image-container partner-image"
				/>
			{/if}
		</div>

		<div class="championship-image-container">
			<img
				width={64}
				height={64}
				src={reign.Championship.image}
				use:errorimage={'/unknown-championship.webp'}
				alt={reign.Championship.name}
				class="total-image roster-lazy-image-championship contain"
			/>
		</div>

		<div class="roster-card-wrestler-name-container">
			<RosterCardName name={reign.Wrestler.name} brand={reign.Championship.brand as string} />
		</div>

		<div class="roster-card-title-reign-dates absolute top right flex acenter gap-smaller">
			<p>Ganado: {reign.won_date}</p>
		</div>

		<div class="roster-card-title-reign-days">
			<p class="days">
				{reign.parsedDays} ({reign.days} días)
			</p>
		</div>
	</div>
	<div
		class="relative roster-card-championship-name-container brand-{reign.Championship.brand?.toLowerCase()}"
	>
		<RosterCardName
			name={reign.Championship.name as string}
			brand={reign.Championship.brand as string}
		/>
	</div>
</div>

<style>
	.partner-image {
		position: absolute;
		top: 0;
		right: -50px;
		object-position: right;
	}
</style>
