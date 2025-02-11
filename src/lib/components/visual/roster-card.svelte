<script lang="ts">
	import { errorimage } from '$lib/actions/error.image';
	import type { Wrestler } from '@prisma/client';
	import RosterCardName from '../../../routes/(public)/champions/roster-card-name.svelte';
	import BrandImage from './brand-image.svelte';

	export let wrestler: Wrestler;
</script>

<div class="w1 entire-roster-champion-card">
	<div class="w1 roster-card relative brand-{wrestler.brand?.toLowerCase()}">
		<div class="overlay-gradient"></div>

		<div class="roster-wrestler-brand">
			<BrandImage brand={wrestler.brand} />
		</div>

		<img
			width={128}
			height={128}
			src={wrestler.image_name}
			use:errorimage={'/vacant.webp'}
			alt={wrestler.name}
			class="total-image roster-lazy-image image-container"
		/>

		<div class="roster-card-wrestler-name-container">
			<RosterCardName name={wrestler.name} brand={wrestler.brand as string} />
		</div>

		<div class="roster-card-title-reign-dates absolute top right flex acenter gap-smaller">
			<p>{wrestler.overall}</p>
		</div>

		<div class="roster-card-title-reign-days">
			<p class="days">
				{wrestler.status}
			</p>
		</div>
	</div>
</div>
