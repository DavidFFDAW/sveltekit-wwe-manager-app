<script lang="ts">
	import { errorimage } from '$lib/actions/error.image.js';
	import AsyncForm from '$lib/components/forms/async-form.svelte';
	let { data } = $props();
	$inspect(data.cashin);
</script>

<div class="page page-container">
	<!-- <header class="page-header">
		<h1>Canjeo MITB</h1>
		<small>{data.cashin.mitb.championship.name}</small>
	</header> -->

	<AsyncForm method="post" reset={true} redirect={data.cashin.parentPage} showButtons={false}>
		<div
			class="ww-mitb-cashin-layout ww-mitb-gender-{data.cashin.mitb.championship.gender.toLowerCase()}"
		>
			<div class="card mitb-holder-info">
				<header class="card-mitb-header">
					<img
						class=""
						src={data.cashin.mitb.championship.image}
						alt={data.cashin.mitb.championship.name}
						use:errorimage={data.statics.mitb}
						width="58"
					/>
					<p>MITB actual</p>
				</header>

				<div class="ww-mitb-holder-image">
					<img
						width="58"
						src={data.cashin.mitb.wrestler.image_name}
						alt={data.cashin.mitb.wrestler.name}
						use:errorimage={data.statics.vacant}
					/>
					<div class="w1 ww-mitb-holder-inner-datas">
						<p>
							<strong>{data.cashin.mitb.wrestler.name}</strong>
						</p>
					</div>
				</div>
				<div class="ww-border ww-mitb-gender"></div>
				<div class="ww-border ww-mitb-date"></div>
				<div class="ww-border ww-mitb-warning"></div>
			</div>
			<div class="card"></div>
		</div>
	</AsyncForm>
</div>

<style>
	.ww-mitb-cashin-layout {
		display: grid;
		grid-template-columns: 340px 1fr;
		margin-top: 20px;
		gap: 15px;
	}
	.card {
		background: #fff;
		border: 1px solid #ccc;
		border-radius: 16px;
		padding: 15px;
	}
	.card.mitb-holder-info {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 20px;
	}
	.card.mitb-holder-info > * {
		width: 100%;
	}
	.ww-mitb-holder-image {
		width: 100%;
		background-color: #eee;
		border: 1px solid #ccc;
		border-radius: 8px;
	}
	.ww-border {
		border-bottom: 1px solid #ccc;
	}

	.mitb-holder-info .card-mitb-header {
		display: flex;
		gap: 15px;
		align-items: center;
		text-align: center;
	}
	.mitb-holder-info .card-mitb-header img {
		width: 58px;
		height: 58px;
		border-radius: 16px;
		background-image: linear-gradient(135deg, #ffe08a, #c78a00);
	}
</style>
