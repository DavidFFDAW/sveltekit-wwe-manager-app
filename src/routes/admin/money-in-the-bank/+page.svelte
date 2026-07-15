<script lang="ts">
	import { errorimage } from '$lib/actions/error.image.js';

	let { data } = $props();
</script>

<section class="page">
	<header class="page-header">
		<h1>MITB</h1>
		<small>Money in the Bank</small>
		<a href="{data.canonical}/upsert" class="btn icon cta down">
			<i class="bi bi-plus-lg"></i>
			Nuevo ganador MITB
		</a>
	</header>

	<form action="" method="get">
		<div class="years-list-container box">
			{#each data.mitb.availableYears as year}
				<button
					type="submit"
					class="btn filter"
					name="year"
					value={year}
					class:active={data.mitb.currentYear === year}
				>
					{year}
				</button>
			{/each}
		</div>
	</form>

	<div class="mitb-holders">
		{#each data.mitb.reigns as reign}
			<div class="mitb-holder">
				<div class="mitb-holder-datas">
					<img
						width="100"
						class="wrestler"
						src={reign.Wrestler.image_name as string}
						alt={reign.Wrestler.name}
						use:errorimage={data.statics.vacant}
					/>
					<img
						width="100"
						class="mitb"
						src={reign.Championship.image}
						alt={reign.Championship.name}
						use:errorimage={data.statics.championship}
					/>
				</div>

				<div class="mitb-reign-datas-container">
					<div class="w1 flex between acenter gap mitb-wrestler-name">
						<span class="title">
							{reign.Wrestler.name}
						</span>
						{#if !reign.lost_date}
							<div class="w1 mitb-cash-in-button flex end acenter">
								<a
									href="{data.canonical}/cash-in?mitb={reign.id}"
									class="btn icon warn mitb-cash-in mitb-gender-{reign.Championship.gender.toLowerCase()}"
								>
									<i class="bi bi-cash"></i>
									<span>Canjear</span>
								</a>
							</div>
						{/if}
					</div>
					<table class="mitb-datas-table">
						<tbody>
							<tr>
								<td class="mitb-table-title"><strong>Victoria</strong></td>
								<td>{reign.won_date}</td>
							</tr>
							<tr>
								<td class="mitb-table-title"><strong>Tiempo</strong></td>
								<td>{reign.days_held}</td>
							</tr>
							{#if reign.lost_date}
								<tr>
									<td class="mitb-table-title"><strong>Canjeo</strong></td>
									<td>{reign.lost_date}</td>
								</tr>
							{/if}
						</tbody>
					</table>

					<div class="holder-status badge tcenter" class:cashed={reign.lost_date}>
						{reign.lost_date ? 'Canjeado' : 'Aún no se ha canjeado'}
					</div>
				</div>
			</div>
		{/each}
	</div>
</section>

<style>
	.years-list-container {
		max-width: 100%;
		display: flex;
		gap: 5px;

		overflow-x: auto;
	}

	.mitb-holders {
		width: 100%;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		margin-top: 1rem;
		gap: 1rem;
	}
	.mitb-holders .mitb-holder {
		position: relative;
		padding: 1rem;
		background: #fff;
		border-radius: 8px;
		border: 1px solid #ddd;

		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	.mitb-holders .mitb-holder .mitb-holder-datas {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 0.5rem;
	}
	.mitb-holders .mitb-holder .mitb-holder-datas img {
		flex: 1;
		object-fit: contain;
		border: 1px solid #ccc;
		border-radius: 8px;
		background-color: #fff;
	}
	.mitb-holders .mitb-holder .mitb-holder-datas img.wrestler {
		/* padding: 0.5rem; */
		padding-bottom: 0;
	}
	.mitb-holders .mitb-holder .mitb-reign-datas-container .mitb-wrestler-name {
		padding: 4px 0;
	}
	.mitb-holders .mitb-holder .mitb-reign-datas-container .mitb-wrestler-name span.title {
		width: 100%;
		font-weight: bold;
		font-size: 1.15rem;
		display: inline-block;
		text-transform: capitalize;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
	}
	.mitb-holders .mitb-holder .mitb-reign-datas-container a.mitb-cash-in {
		color: goldenrod;
		border: 1px solid goldenrod;
		background-color: rgba(218, 165, 32, 0.1);
		align-self: flex-end;
	}
	.mitb-holders .mitb-holder .mitb-reign-datas-container a.mitb-cash-in.mitb-gender-m {
		margin-top: 0.5rem;
		display: inline-block;
		align-self: flex-end;

		color: green;
		border: 1px solid green;
		background-color: rgba(0, 128, 0, 0.1);
	}
	.mitb-holders .mitb-holder .mitb-reign-datas-container .holder-status {
		position: absolute;
		top: 10px;
		right: 10px;
		background-color: rgba(0, 0, 0, 0.7);
		font-size: 0.75rem;
	}
	.mitb-holders .mitb-holder .mitb-reign-datas-container .holder-status.cashed {
		background-color: #28a745;
	}

	table.mitb-datas-table {
		width: 100%;
		max-width: 100%;
		border-collapse: collapse;
		border-radius: 8px;
		margin-top: 5px;
	}
	table.mitb-datas-table td {
		padding: 6px;
		border: 1px solid #ddd;
	}
	table.mitb-datas-table .mitb-table-title {
		background-color: #eee;
		font-weight: bold;
	}
	table.mitb-datas-table .mitb-table-title + td {
		width: 100%;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		font-size: 0.95rem;
	}
</style>
