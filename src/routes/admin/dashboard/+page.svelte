<script lang="ts">
	import PageWrapper from '$lib/components/page-wrapper/page-wrapper.svelte';
	import type { PPV } from '@prisma/client';
	import PpvCounter from './ppv-counter.svelte';
	import { DashboardLinks } from './dashboard.links';
	export let data: { nextPpv: PPV };
</script>

<PageWrapper page="dashboard">
	<div class="admin-page-wrapper admin-dashboard">
		{#if data.nextPpv}
			<header class="next-ppv-date-wrapper flex gap-medium ignore-main-padding">
				<PpvCounter finalDate={data.nextPpv.game_date as Date} ppv={data.nextPpv} />
			</header>
		{/if}
		<div class="down">
			<h1>Dashboard</h1>
			<nav class="admin-dashboard-page-navigation down" style="margin-top: 50px;">
				<ul class="grid three-column-grid gap-20 admin-dashboard-list responsive" role="list">
					{#each DashboardLinks as link}
						<li
							class="w1 background"
							style="background-image: url('{link.background ||
								'https://media.istockphoto.com/id/1665661357/vector/bright-stadium-lights-vector-design.jpg?s=612x612&w=0&k=20&c=fPARi4dhnmIQprMY4_EneLckTQBVfns1Z1dnwl7CbE8='}')"
						>
							<a href={link.url}>
								<span>{link.label}</span>
								<img src={link.image} alt="" draggable="false" aria-hidden="true" loading="lazy" />
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
	</div>
</PageWrapper>

<style>
	:root {
		/* --dashboard-item-bg: url('https://cdn.pixabay.com/photo/2016/11/18/22/58/stars-1837306_640.jpg'); */
		/* --dashboard-item-bg: url('https://cdn.pixabay.com/photo/2016/11/18/22/58/stars-1837306_640.jpg'); */
		--dashboard-item-bg: url('https://media.istockphoto.com/id/1665661357/vector/bright-stadium-lights-vector-design.jpg?s=612x612&w=0&k=20&c=fPARi4dhnmIQprMY4_EneLckTQBVfns1Z1dnwl7CbE8=');
	}
	ul.admin-dashboard-list {
		gap: 40px 20px;
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
