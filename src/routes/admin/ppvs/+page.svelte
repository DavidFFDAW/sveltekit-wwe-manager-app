<script lang="ts">
	// import Calendar from './calendar.svelte';
	export let data;
</script>

<!-- <div class="w1">
	<Calendar ppvs={data.ppvs} />
</div> -->

<div class="ppvs-inner-list">
	<div class="ppvs-list resource-list grid">
		{#each data.ppvs as ppv}
			<div class="ppv-card card relative active">
				<img
					class="ppv-image"
					width="200"
					height="200"
					loading="lazy"
					src={ppv.image}
					alt={ppv.name}
					data-src={ppv.image}
					data-srcerror="/noimage.jpg"
					draggable="false"
					aria-label={ppv.name}
				/>
				<div class="ppv-card-inner flex astart column between gap">
					<div class="datas-block">
						<h4 class="pp-name">{ppv.name} <small>{ppv.abbreviation}</small></h4>
						{#if ppv.game_date}<p>
								{ppv.game_date.toLocaleDateString('es-ES', {
									year: 'numeric',
									month: 'short',
									day: 'numeric'
								})}
							</p>{/if}
						<div class="ppv-city">
							<p>{ppv.city}</p>
							<small>{ppv.stadium}</small>
						</div>
					</div>
					<div class="flex between gap-small ppv-buttons-group">
						<div class="grouped-actions-button-container unshown">
							<button
								type="button"
								class="w1 relative btn flex acenter gap-small grouped-action-button parent-button"
								><span class="label">Acciones</span><i
									class="bi bi-caret-down-fill customs-icons app-bootstrap-custom-icon"
								></i></button
							>
						</div>
						<a class="btn btn-update btn-icon" href="/private/shows/update/2"
							><i class="bi bi-pencil customs-icons app-bootstrap-custom-icon"></i>Editar</a
						>
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	.ppvs-list.resource-list.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
		gap: 10px;
	}
	.ppvs-inner-list .ppv-card {
		width: 100%;
		background-color: #fff;
		border-radius: 10px;
		box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
	}

	.ppvs-inner-list .ppv-card-inner {
		padding: 10px;
	}

	.ppvs-inner-list .ppv-card-inner .ppv-city {
		display: flex;
		align-items: flex-end;
		justify-content: flex-end;
		flex-direction: column;
		top: 110px;
		right: -10px;
		font-size: 16px;
		font-weight: 600;
		padding: 5px 10px;
		position: absolute;
		background: #9cfffa;
		box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
	}

	.ppvs-inner-list .ppv-card-inner .ppv-city small {
		display: block;
		font-size: 10px;
	}

	.ppvs-inner-list .ppv-card-inner .ppv-city:after {
		content: '';
		position: absolute;
		top: -6px;
		right: 3px;
		width: 41px;
		height: 28px;
		transform: rotate(15deg);
		background: #223caf;
		z-index: -1;
	}

	.ppvs-inner-list img.ppv-image {
		width: 100%;
		height: 150px;
		border-radius: 10px 10px 0 0;
		background-color: #000;
		object-fit: contain;
	}

	.ppvs-inner-list .ppv-card {
		width: 240px;
	}

	.ppvs-inner-list .ppv-card.inactive img.ppv-image {
		filter: grayscale(1) blur(1px);
	}

	.ppvs-inner-list
		.ppv-card
		.ppv-buttons-group
		.grouped-actions-button-container
		.grouped-action-button {
		background-color: transparent;
		border: 2px solid #167ebe;
		color: #167ebe;
	}

	.ppvs-inner-list
		.ppv-card
		.ppv-buttons-group
		.grouped-actions-button-container
		.grouped-action-button
		.btn {
		border-radius: 0;
		border: none;
		width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.ppvs-inner-list
		.ppv-card
		.ppv-buttons-group
		.grouped-actions-button-container
		.grouped-action-button
		span.label {
		color: inherit;
	}

	.ppvs-inner-list .ppv-card .ppv-buttons-group .btn {
		padding: 6px;
	}

	.ppvs-inner-list .ppv-card .ppv-buttons-group i {
		color: inherit;
	}
</style>
