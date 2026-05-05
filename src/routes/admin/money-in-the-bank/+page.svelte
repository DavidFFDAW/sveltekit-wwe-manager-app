<script lang="ts">
	let { data } = $props();
	$inspect(data.mitb);
</script>

<section class="page">
	<header class="page-header">
		<h1>Money in the Bank</h1>
		<form action="" method="get" class="box">
			<div class="input-group">
				{#each data.mitb.availableYears as year}
					<label class="w1 radio-label flex start acenter gap-5">
						<input
							type="radio"
							id={year}
							name="year"
							value={year}
							checked={year === data.mitb.currentYear}
						/>
						{year}
					</label>
				{/each}
			</div>

			<button type="submit">Filter</button>
		</form>

		<div class="mitb-holders down">
			{#each data.mitb.reigns as reign}
				<div class="mitb-holder">
					<div class="holder-name">{reign.Wrestler.name}</div>
					<div class="holder-date">{reign.won_date}</div>
					<div class="holder-days">{reign.days_held}</div>
					<div class="holder-status badge tcenter" class:cashed={reign.lost_date}>
						{reign.lost_date ? 'Canjeado' : 'Aún no se ha canjeado'}
					</div>
				</div>
			{/each}
		</div>
	</header>
</section>

<style>
	.mitb-holders {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1rem;
	}
	.mitb-holder {
		background: #fff;
		border: 1px solid #ddd;
		padding: 1rem;
		border-radius: 8px;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	.mitb-holder .holder-name {
		font-weight: bold;
		font-size: 1.2rem;
	}
	.mitb-holder .holder-date,
	.mitb-holder .holder-days {
		font-size: 0.9rem;
		color: #555;
	}
	.mitb-holder .holder-status {
		font-size: 0.8rem;
	}
	.mitb-holder .holder-status.cashed {
		background-color: #28a745;
	}
</style>
