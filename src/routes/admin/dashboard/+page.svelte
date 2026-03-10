<script lang="ts">
	import PageWrapper from '$lib/components/page-wrapper/page-wrapper.svelte';
	import PpvCounter from './ppv-counter.svelte';
	import RumbleWinners from './components/rumble-winners.svelte';
	import { DashboardLinks } from './dashboard.links';
	import { page } from '$app/state';

	let { data } = $props();
	const rumbles = data.dashboard.rumbles as any[];
	const paramTest = page.url.searchParams.get('test');
	let test = paramTest || (Math.random() > 0.5 ? 'a' : 'b');

	const links = DashboardLinks.map((it) => {
		if (test === 'b')
			return {
				...it,
				image: null,
				background: it.testb || it.background
			};
		return it;
	});
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

			{#if data.dashboard.missingRatings && data.dashboard.missingRatings.length > 0}
				<div class="missing-ratings-notification background">
					<h2>Missing Ratings</h2>
					<p>The following match cards are missing ratings:</p>
					<ul>
						{#each data.dashboard.missingRatings as card}
							<li>{card.ppv_name} (PPV: {card.ppv_name})</li>
						{/each}
					</ul>
				</div>
			{/if}

			{#if data.dashboard.drafts.length > 0}
				<div class="drafts-notification background">
					<h2>Drafts</h2>
					<p>You have {data.dashboard.drafts.length} drafts in progress:</p>
					<ul>
						{#each data.dashboard.drafts as draft}
							<li>
								<a href={`/admin/blog/${draft.slug}/edit`}>{draft.title}</a>
							</li>
						{/each}
					</ul>
				</div>
			{/if}

			<pre>
                {JSON.stringify(data.dashboard, null, 5)}
            </pre>

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
