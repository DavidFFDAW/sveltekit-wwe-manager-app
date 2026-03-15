<script lang="ts">
	import PageWrapper from '$lib/components/page-wrapper/page-wrapper.svelte';
	import PpvCounter from './ppv-counter.svelte';
	import RumbleWinners from './components/rumble-winners.svelte';
	import { DashboardLinks } from './dashboard.links';
	import { page } from '$app/state';
	import NotificationCard from './components/notification-card.svelte';

	let { data } = $props();
	// @typescript-eslint/no-explicit-any
	const rumbles = data.dashboard.rumbles;
	const paramTest = page.url.searchParams.get('test');
	let test = paramTest || (Math.random() > 0.8 ? 'a' : 'b');

	const missingRatings = data.dashboard.missingRatings || [];
	const drafts = data.dashboard.drafts || [];

	const links = DashboardLinks.map((it) => ({
		...it,
		image: test === 'b' ? null : it.image,
		background: test === 'b' ? it.testb || it.background : it.background
	}));
</script>

<PageWrapper page="dashboard">
	<div class="admin-page-wrapper admin-dashboard">
		{#if data.dashboard.nextPpv}
			<header class="next-ppv-date-wrapper flex gap-medium ignore-main-padding">
				<PpvCounter
					finalDate={data.dashboard.nextPpv.game_date as Date}
					ppv={data.dashboard.nextPpv}
				/>
			</header>
		{/if}

		<div class="down">
			<h1>Dashboard</h1>

			<div class="notifications">
				{#if missingRatings && missingRatings.length > 0}
					<div class="missing-ratings-notification">
						<h3>Tienes {missingRatings.length} eventos sin calificar o sin ganador:</h3>

						<ul class="w1 missing-ratings-list">
							{#each missingRatings as card}
								<NotificationCard
									id={card.id}
									name={card.ppv_name}
									image={card.ppv_image}
									date={card.ppv_date}
									url={`/admin/matchcards/rating?slug=${card.id}`}
								/>
							{/each}
						</ul>
					</div>
				{/if}

				{#if drafts.length > 0}
					<div class="missing-ratings-notification">
						<h3>Tienes {drafts.length} borradores sin publicar:</h3>

						<ul class="w1 missing-ratings-list">
							{#each drafts as draft}
								<NotificationCard
									id={draft.id}
									name={draft.title}
									image={draft.image}
									date={draft.created_at}
									url={`/admin/blog/update/${draft.id}`}
								/>
							{/each}
						</ul>
					</div>
				{/if}
			</div>

			{#if rumbles.length > 0}
				<RumbleWinners {rumbles} />
			{/if}

			<div class="dashboard test-{test}">
				<nav class="admin-dashboard-page-navigation down" style="margin-top: 50px;">
					<ul class="grid three-column-grid gap-20 admin-dashboard-list responsive" role="list">
						{#each links as link}
							<li
								class="w1 background"
								style="background-image: url('{link.background ||
									'https://media.istockphoto.com/id/1665661357/vector/bright-stadium-lights-vector-design.jpg?s=612x612&w=0&k=20&c=fPARi4dhnmIQprMY4_EneLckTQBVfns1Z1dnwl7CbE8='}')"
							>
								<a href={link.url}>
									<span>{link.label}</span>
									{#if link.image}
										<img
											src={link.image}
											alt=""
											draggable="false"
											aria-hidden="true"
											loading="lazy"
										/>
									{/if}
								</a>
							</li>
						{/each}

						<li
							class="w1 background"
							style="background-image: url('https://i.pinimg.com/736x/46/85/06/46850696178107a751c26d4e22eb3c2e.jpg')"
						>
							<a href="/admin/rumble">
								<span>Royal Rumble</span>
							</a>
						</li>
					</ul>
				</nav>
			</div>

			<span class="test fixed">{test}</span>
		</div>
	</div>
</PageWrapper>

<style>
	.notifications {
		margin-top: 30px;
	}
	.notifications > div {
		margin-bottom: 30px;
	}

	.missing-ratings-notification .missing-ratings-list {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		align-items: stretch;
		gap: 6px;
	}
	.missing-ratings-notification .missing-ratings-list .missing-rating-list-item {
		width: 100%;
		display: flex;
		justify-content: space-between;
		flex-direction: column;
		align-items: flex-end;
		background-color: #fff;
		border-radius: 10px;
		padding: 10px 8px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
		gap: 1px;
	}
	.missing-ratings-notification .missing-ratings-list .missing-rating-list-item img {
		max-width: 100%;
		border-radius: 5px;
		border: 1px solid #333;
		object-fit: cover;
	}

	.missing-ratings-notification
		.missing-ratings-list
		.missing-rating-list-item
		.missing-rating-title {
		font-weight: bold;
		text-transform: uppercase;
	}
	.missing-ratings-notification .missing-ratings-list .missing-rating-list-item small {
		font-size: 0.7em;
		color: #666;
		line-height: 1;
	}
	.missing-ratings-notification .missing-ratings-list .btn-check-ppv {
		position: relative;
		background-color: transparent;
		margin-right: 5px;
		border: none;
		color: #fff;
		font-size: 1em;
		text-transform: uppercase;
		cursor: pointer;
		z-index: 1;
	}
	.missing-ratings-notification .missing-ratings-list .btn-check-ppv::after {
		content: '';
		position: absolute;
		background-color: #333;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		border-radius: 5px;
		transform: skew(-8deg);
		z-index: -1;
	}

	span.test.fixed {
		position: fixed;
		bottom: 1rem;
		right: 0;
		padding: 0.5rem 1rem;
		background-color: #333;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
		color: #fff;
		text-transform: uppercase;
		font-size: 25px;
		border-radius: 8px 0 0 8px;
	}
	:root {
		/* --dashboard-item-bg: url('https://cdn.pixabay.com/photo/2016/11/18/22/58/stars-1837306_640.jpg'); */
		/* --dashboard-item-bg: url('https://cdn.pixabay.com/photo/2016/11/18/22/58/stars-1837306_640.jpg'); */
		--dashboard-item-bg: url('https://media.istockphoto.com/id/1665661357/vector/bright-stadium-lights-vector-design.jpg?s=612x612&w=0&k=20&c=fPARi4dhnmIQprMY4_EneLckTQBVfns1Z1dnwl7CbE8=');
	}
	ul.admin-dashboard-list {
		gap: 20px 20px;
	}
	ul.admin-dashboard-list li a {
		justify-content: center;
	}
	ul.admin-dashboard-list li {
		height: 200px;
		position: relative;
		border-radius: 8px;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
		background-color: #ffffff;
		background-image: var(--dashboard-item-bg);
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
	}
	.dashboard.test-b ul.admin-dashboard-list li {
		height: auto;
		min-height: 250px;
		background-position: top;
	}

	ul.admin-dashboard-list li a {
		padding: 1rem;
		display: flex;
		position: relative;
		width: 100%;
		height: 100%;
		align-items: flex-end;
		color: #ffffff;
		text-decoration: none;
		font-family: 'dreadnotus', sans-serif;
		text-transform: uppercase;
		font-size: 20px;
	}
	ul.admin-dashboard-list li a span {
		position: relative;
		z-index: 20;
		text-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
		display: block;
		background-color: rgba(0, 0, 0, 0.5);
		padding: 0.5rem 1rem;
	}

	ul.admin-dashboard-list li img {
		position: absolute;
		bottom: 0;
		width: 238px;
		object-fit: cover;
		object-position: right;
		transition: transform 0.3s;
		transform-origin: bottom;
		border-radius: 0 0 8px 8px;
		z-index: 1;
	}

	ul.admin-dashboard-list li:hover img {
		transform: scale(1.05);
	}
	ul.admin-dashboard-list li a span {
		position: relative;
		border-bottom: 4px solid transparent;
	}

	ul.admin-dashboard-list li a:hover span {
		border-bottom: 4px solid #c91727;
	}
	ul.admin-dashboard-list li a:hover span::after {
		width: 60px;
	}

	@media screen and (max-width: 1250px) {
		.admin-dashboard-list {
			grid-template-columns: repeat(2, 1fr);
		}
	}
	@media screen and (max-width: 768px) {
		.admin-dashboard-list {
			grid-template-columns: repeat(1, 1fr);
		}
		ul.admin-dashboard-list li:nth-child(odd) a {
			justify-content: flex-end;
			text-align: right;
		}

		ul.admin-dashboard-list li:nth-child(even) a {
			justify-content: flex-start;
		}

		ul.admin-dashboard-list li:nth-child(odd) a img {
			left: 0;
			object-position: left;
		}

		ul.admin-dashboard-list li:nth-child(even) a img {
			right: 0;
			object-position: left;
		}
		ul.admin-dashboard-list li img {
			width: 220px;
		}

		ul.admin-dashboard-list li a {
			font-size: 18px;
			align-items: flex-end;
		}
		ul.admin-dashboard-list li a::after {
			top: calc(100% - 20px);
		}

		.admin-dashboard-list {
			gap: 35px;
		}
	}
</style>
