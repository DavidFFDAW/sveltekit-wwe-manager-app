<script lang="ts">
	import { errorimage } from '$lib/actions/error.image.js';
	import AsyncForm from '$lib/components/forms/async-form.svelte';
	let { data } = $props();

	let cashin = data.cashin;
	let mitb = cashin.mitb;
	let gender = mitb.championship.gender.toLowerCase();
	let holder = mitb.wrestler;
	let champ_text = gender === 'f' ? 'campeona' : 'campeón';

	let selectedChampionshipId: number | null = $state(null);
	let selectedChampion = $derived(
		cashin.availableChampionships.find((reign) => reign.championship.id === selectedChampionshipId)
			?.wrestler || null
	);

	$inspect(cashin);
</script>

<svelte:head>
	<link
		rel="stylesheet"
		href="{data.src_path}/cash-in.css"
		class="wwe-aaaaaaaaaaa"
		data-css="yes"
	/>
</svelte:head>

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
				<div class="ww-border ww-mitb-gender">
					<p>
						<strong>Género:</strong>
						{gender === 'f' ? 'Femenino' : 'Masculino'}
					</p>
				</div>
				<div class="ww-border ww-mitb-date">
					<p>
						<strong>Fecha de victoria:</strong>
						{mitb.date}
					</p>
				</div>
				<div class="ww-border ww-mitb-warning">
					<p>
						<strong>Advertencia:</strong>
						El canjeo de este MITB se hará efectivo inmediatamente, por lo que el nuevo campeón aparecerá
						en la sección de campeones y el anterior dejará de serlo.
					</p>
				</div>
			</div>

			<div class="card">
				<div class="form-section">
					<div class="section-title">
						<span>01</span>
						<div>
							<h2>Selecciona el campeonato</h2>
							<p>Solo aparecen títulos compatibles con el género del maletín.</p>
						</div>
					</div>

					<div class="championship-grid">
						{#each data.cashin.availableChampionships as reign}
							<label class="championship-option">
								<input type="radio" name="championship_id" value={reign.championship.id} />
								<div>
									<img width="150" src={reign.championship.image} alt={reign.championship.name} />
									<strong>{reign.championship.name}</strong>
									<span>{champ_text} actual: {reign.wrestler.name}</span>
								</div>
							</label>
						{/each}
					</div>
				</div>

				<div class="form-section">
					<div class="section-title">
						<span>02</span>
						<div>
							<h2>Datos del canjeo</h2>
							<p>Indica cuándo y dónde se produjo el momento.</p>
						</div>
					</div>

					<div class="form-grid">
						<label class="field">
							<span>Fecha del canjeo</span>
							<input type="date" name="cashin_date" />
						</label>

						<label class="field">
							<span>Evento</span>
							<select name="ppv_won">
								<option value="">Seleccionar evento</option>
								<option>Raw</option>
								<option>SmackDown</option>
								<option>SummerSlam</option>
								<option>WrestleMania</option>
							</select>
						</label>
					</div>
				</div>

				<div class="cashin-preview">
					<div>
						<span>Resultado del canjeo</span>
						<strong
							>{holder.name} será registrada como nueva {champ_text}. {selectedChampion
								? `${selectedChampion.name} dejará de ser ${champ_text}.`
								: ''}</strong
						>
					</div>
					<button type="submit" class="btn btn cta">Confirmar canjeo</button>
				</div>
			</div>
		</div>
	</AsyncForm>
</div>

<style>
	.ww-mitb-cashin-layout {
		display: flex;
		justify-content: flex-start;
		align-items: flex-start;
		grid-template-columns: 340px 1fr;
		margin-top: 20px;
		gap: 15px;
	}
	.ww-mitb-cashin-layout .card {
		flex: 1;
		width: 100%;
	}
	.ww-mitb-cashin-layout .card:first-child {
		max-width: 340px;
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

	@media (max-width: 768px) {
		.ww-mitb-cashin-layout {
			flex-direction: column;
		}
		.ww-mitb-cashin-layout .card:first-child {
			max-width: none;
		}
	}
</style>
