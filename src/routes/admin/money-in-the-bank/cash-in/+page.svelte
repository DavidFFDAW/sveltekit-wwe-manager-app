<script lang="ts">
	import { errorimage } from '$lib/actions/error.image.js';
	import AsyncForm from '$lib/components/forms/async-form.svelte';
	let { data } = $props();

	let cashin = data.cashin;
	let mitb = cashin.mitb;
	let gender = mitb.championship.gender.toLowerCase();
	let champ_text = gender === 'f' ? 'campeona' : 'campeón';
</script>

<div class="page page-container">
	<!-- <header class="page-header">
		<h1>Canjeo MITB</h1>
		<small>{data.cashin.mitb.championship.name}</small>
	</header> -->

	<AsyncForm method="post" reset={true} redirect={data.cashin.parentPage} showButtons={false}>
		<input type="hidden" name="mitb_id" value={mitb.id} />
		<input type="hidden" name="wrestler_id" value={mitb.wrestler.id} />

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
					<h2>MITB actual</h2>
				</header>

				<div class="wrestler-card">
					<img src={mitb.wrestler.image_name} alt="Wrestler" use:errorimage={data.statics.vacant} />
					<div>
						<strong>{mitb.wrestler.name}</strong>
						<span>Ganadora del MITB {gender === 'f' ? 'femenino' : 'masculino'}</span>
					</div>
				</div>

				<div class="summary-list">
					<div>
						<span>Maletín</span>
						<strong>{mitb.championship.name}</strong>
					</div>
					<div>
						<span>Género</span>
						<strong>{gender === 'f' ? 'Femenino' : 'Masculino'}</strong>
					</div>
					<div>
						<span>Fecha de victoria</span>
						<strong>{mitb.date}</strong>
					</div>
				</div>

				<div class="ww-mitb-notice">
					Al confirmar, el <strong>Money in the Bank</strong> quedará marcado como
					<strong>canjeado</strong> y se creará el <strong>nuevo reinado</strong> para el luchador que
					tenía el maletín.
				</div>
			</div>

			<div class="card form-card-container">
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
								<div class="championship-option-item">
									<img
										width="150"
										src={reign.championship.image}
										alt={reign.championship.name}
										use:errorimage={data.statics.championship}
									/>
									<strong>{reign.championship.name}</strong>
									<span>{reign.wrestler.name}</span>
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

					<div class="form-grid mitb-datas-container">
						<label class="label form-item">
							<span class="label-text">Fecha del canjeo</span>
							<input type="date" name="cashin_date" max={data.cashin.today} />
						</label>

						<label class="label form-item">
							<span class="label-text">Evento</span>
							<select name="ppv_won">
								<option value="">Seleccionar evento</option>
								{#each data.cashin.ppvs as ppv}
									<option value={ppv}>{ppv}</option>
								{/each}
							</select>
						</label>
					</div>
				</div>

				<div class="cashin-preview">
					<div>
						<span>Resultado del canjeo</span>
						<strong>{mitb.wrestler.name} será registrado/a como nueva {champ_text}.</strong>
					</div>
					<button type="submit" class="btn btn-primary"> Confirmar canjeo </button>
				</div>
			</div>
		</div>
	</AsyncForm>
</div>

<style>
	:root {
		--bg: #f4f6fb;
		--surface: #ffffff;
		--surface-soft: #f8fafc;
		--text: #172033;
		--muted: #737f91;
		--border: #e3e8f0;
		--primary: #d4a017;
		--primary-dark: #a67800;
		--danger-soft: #fff3d6;
	}

	h2,
	p,
	span,
	label {
		line-height: 1;
		font-family: 'sourcesans', sans-serif;
	}

	.wrestler-card {
		display: flex;
		align-items: center;
		gap: 14px;
		padding: 14px;
		background: #f8fafc;
		border-radius: 8px;
		border: 1px solid #ccc;
	}

	.wrestler-card img {
		width: 60px;
		height: auto;
		border-radius: 10px;
		border: 1px solid #ccc;
		background-color: #fff;
		object-fit: cover;
	}

	.wrestler-card span {
		color: #737f91;
		font-size: 14px;
	}
	.wrestler-card strong {
		font-size: 16px;
		font-weight: 600;
		color: #111827;
		text-transform: uppercase;
	}
	.wrestler-card span,
	.wrestler-card strong {
		display: block;
	}

	label.label {
		width: 100%;
		display: flex;
		position: relative;
		flex-direction: column;
		gap: 4px;
	}
	label.label span.label-text {
		font-size: 16px;
		font-weight: 600;
		text-transform: uppercase;
		color: #000;
	}
	label.label select,
	label.label input {
		width: 100%;
		height: 45px;
		outline: none;
		font-size: 14px;
		max-height: 45px;
		font-family: 'sourcesans', sans-serif;
		background-color: #fff;
		border: 1px solid #ddd;
		border-radius: 5px;
		padding: 10px;
	}

	.form-grid.mitb-datas-container {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

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
	.ww-mitb-cashin-layout .card.form-card-container {
		display: flex;
		flex-direction: column;
		gap: 30px;
	}

	.section-title {
		display: flex;
		align-items: center;
		gap: 10px;
		margin-bottom: 15px;
	}
	.section-title span {
		font-size: 18px;
		font-weight: bold;
		background-color: #111827;
		color: #fff;
		padding: 5px 10px;
		border-radius: 8px;
	}
	.section-title h2 {
		margin: 0;
		font-size: 20px;
		text-transform: uppercase;
	}
	.section-title p {
		margin: 0;
		font-size: 15px;
		color: #454545;
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

	.ww-mitb-notice {
		padding: 14px;
		border-radius: 16px;
		background: #fff8e6;
		color: #8a6400;
		border: 1px solid #d4a017;
		font-size: 16px;
		line-height: 1.1;
	}
	.summary-list {
		display: grid;
		gap: 14px;
	}
	.summary-list > div {
		padding-bottom: 14px;
		border-bottom: 1px solid #e3e8f0;
	}
	.summary-list > div span {
		position: relative;
		font-size: 14px;
		color: #737f91;
		text-transform: uppercase;
	}
	.summary-list > div span::after {
		content: '';
		position: absolute;
		bottom: 2px;
		left: 0;
		width: 40%;
		height: 2px;
		background-color: var(--primary);
	}

	.summary-list > div strong {
		display: block;
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

	.cashin-preview {
		padding: 15px;
		border-radius: 20px;
		background: #111827;
		color: white;
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 18px;
	}
	.cashin-preview span {
		display: block;
		color: #cbd5e1;
		font-size: 13px;
		text-transform: uppercase;
		margin-bottom: 2px;
	}
	.cashin-preview strong {
		margin: 0;
		font-size: 16px;
		font-weight: 800;
	}

	.cashin-preview .btn.btn-primary {
		color: #1f1600;
		display: block;
		align-items: center;
		justify-content: center;
		border: 0;
		border-radius: 14px;
		padding: 8px 18px;
		font-weight: 800;
		text-decoration: none;
		background: var(--primary);
		cursor: pointer;
	}

	.championship-grid {
		width: 100%;
		max-width: 100%;
		padding: 10px;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
		overflow-x: auto;
		gap: 10px;
	}
	.championship-grid label {
		position: relative;
		height: 100%;
	}
	.championship-grid label input {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		padding: 0;
		margin: 0;
		opacity: 0;
		cursor: pointer;
	}
	.championship-grid label .championship-option-item {
		width: 100%;
		height: 100%;
		padding: 10px;
		border-radius: 8px;
		border: 1px solid #ddd;

		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	.championship-grid label .championship-option-item span {
		position: absolute;
		top: 10px;
		right: 10px;
		display: block;
		font-size: 13px;
		padding: 4px 10px;
		border-radius: 50px;
		color: #fff;
		background-color: rgba(0, 0, 0, 0.6);
		z-index: 1;
	}

	.championship-grid label .championship-option-item strong {
		display: block;
		font-size: 14px;
		text-align: center;
		font-weight: 600;
		color: #111827;
		margin-top: 12px;
	}

	.championship-grid label input:checked + .championship-option-item {
		border-color: var(--primary);
		border-width: 2px;
		background-color: #fffaf0;
		box-shadow: 0 0 0 4px rgba(212, 160, 23, 0.15);
	}

	@media (max-width: 1024px) {
		.ww-mitb-cashin-layout {
			flex-direction: column;
		}
		.ww-mitb-cashin-layout .card:first-child {
			max-width: none;
		}
	}
	@media (max-width: 375px) {
		.cashin-preview {
			flex-direction: column;
			align-items: flex-start;
			gap: 8px;
		}
		.cashin-preview .btn {
			width: 100%;
			text-align: center;
		}
	}
</style>
