<script lang="ts">
	import { errorimage } from '$lib/actions/error.image';
	import AsyncForm from '$lib/components/forms/async-form.svelte';

	let { data } = $props();
	let wrestlers = $derived(data.wrestlers.list);
</script>

<h1>Marcas</h1>

<div class="page-content down">
	<AsyncForm method="post" showButtons={false}>
		<ul>
			{#each wrestlers as wrestler}
				<li class="row wrestler-item">
					<div class="w1 flex start gap-smaller">
						<div class="avatar" aria-hidden="true">
							<img
								width="88"
								height="88"
								src={wrestler.image_name}
								use:errorimage={'/vacant.webp'}
								alt={wrestler.name}
							/>
						</div>

						<div class="name">
							<strong>{wrestler.name}</strong>
							<span class="id">#{wrestler.id} - {wrestler.brand}</span>
						</div>
					</div>

					<div class="w1 wrestler-brand-toggle-container">
						<label class="relative">
							<input
								name="brand[{wrestler.id}]"
								type="radio"
								class="app-radio"
								value="raw"
								bind:group={wrestler.brand}
							/>
							<div class="inner inner-brand brand-raw">
								<img width="25" src="/brands/raw.webp" alt="RAW" />
							</div>
						</label>

						<label class="relative">
							<input
								name="brand[{wrestler.id}]"
								type="radio"
								class="app-radio"
								value="smackdown"
								bind:group={wrestler.brand}
							/>
							<div class="inner inner-brand brand-smackdown">
								<img width="25" src="/brands/smackdown.webp" alt="SMACKDOWN" />
							</div>
						</label>

						<label class="relative">
							<input
								name="brand[{wrestler.id}]"
								type="radio"
								class="app-radio"
								value="awl"
								bind:group={wrestler.brand}
							/>
							<div class="inner inner-brand brand-awl">
								<img width="25" src="/brands/awl.webp" alt="AWL" />
							</div>
						</label>
					</div>
				</li>
			{/each}
		</ul>

		<div class="button-container fixed">
			<div class="button-content">
				<small>Pagina {data.wrestlers.currentPage} de {data.wrestlers.pages}</small>
				<div class="pagination-buttons">
					<a
						href="{data.path}?page={data.wrestlers.currentPage - 1}"
						class="btn"
						class:disabled={data.wrestlers.currentPage === 1}
						aria-label="Página anterior"
						title="Página anterior"
					>
						<i class="bi bi-chevron-left"></i>
					</a>
					<a
						href="{data.path}?page={data.wrestlers.currentPage + 1}"
						class="btn"
						class:disabled={data.wrestlers.currentPage === data.wrestlers.pages}
						aria-label="Página siguiente"
						title="Página siguiente"
					>
						<i class="bi bi-chevron-right"></i>
					</a>
				</div>
				<button type="submit" class="btn primary cta">Guardar cambios</button>
			</div>
		</div>
	</AsyncForm>
</div>

<style>
	.button-container.fixed {
		position: fixed;
		width: 100%;
		padding: 10px;
		padding-left: calc(var(--sidebar-width) + 10px);
		background-color: #fff;
		border-top: 1px solid #ddd;
		box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
		display: flex;
		justify-content: center;
		bottom: 0px;
		right: 0px;
		z-index: 10;
	}
	.button-container.fixed .button-content {
		width: 100%;
		max-width: 600px;
		padding: 0 10px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 4px;
	}

	.pagination-buttons {
		display: flex;
		gap: 4px;
	}
	.pagination-buttons a.btn {
		padding: 6px 10px;
		border: 1px solid #ddd;
		background: rgba(255, 255, 255, 0.03);
		color: #333;
		border-radius: 8px;
	}
	.pagination-buttons a.btn.disabled {
		background: rgba(255, 255, 255, 0.01);
		color: rgba(51, 51, 51, 0.5);
	}

	.page-content {
		max-width: 600px;
		margin: 0 auto;
		padding: 1rem 0;
		padding-bottom: 80px;
	}
	ul {
		list-style: none;
		margin: 0;
		padding: 0;
		border: 1px solid #ddd;
		background: #fff;
		border-radius: 12px;
		box-shadow: 0 0px 12px rgba(0, 0, 0, 0.2);
		overflow: hidden;
	}
	.row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 12px 14px;
		gap: 5px;
	}
	.row {
		border-bottom: 1px solid #ddd;
		background: rgba(255, 255, 255, 0.01);
		transition:
			background 0.18s ease,
			transform 0.18s ease;
	}

	.row:hover {
		background: rgba(255, 255, 255, 0.03);
	}

	.row:last-child {
		border-bottom: 0;
	}

	.id {
		font-variant-numeric: tabular-nums;
		color: #333;
	}

	.avatar {
		width: 44px;
		height: 44px;
		border-radius: 12px;
		overflow: hidden;
		border: 1px solid #ddd;
		background: linear-gradient(180deg, #eee 0%, #6f6f6f 75%);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.avatar img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	.name {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 3px;
		min-width: 0;
		max-width: 80px;
	}

	.name strong {
		font-size: 14px;
		/* white-space: nowrap; */
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.name span {
		font-size: 12px;
		color: #333;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	/* Toggle */
	.wrestler-brand-toggle-container {
		display: grid;
		grid-template-columns: repeat(3, auto);
		gap: 6px;
	}

	.wrestler-brand-toggle-container label {
		cursor: pointer;
	}

	.wrestler-brand-toggle-container .inner {
		width: 50px;
		height: 28px;
		border: 1px solid #ddd;
		border-radius: 8px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(255, 255, 255, 0.03);
		transition:
			background 0.18s ease,
			border-color 0.18s ease;
	}

	.wrestler-brand-toggle-container input[type='radio']:checked + .inner {
		box-shadow: none;
		border: 2px solid #007bff;
		background-color: rgba(0, 123, 255, 0.1);
	}
	.wrestler-brand-toggle-container input[type='radio']:checked + .inner.brand-raw {
		border-color: var(--raw);
		background-color: rgba(244, 67, 54, 0.1);
	}
	.wrestler-brand-toggle-container input[type='radio']:checked + .inner.brand-smackdown {
		border-color: var(--smackdown);
		background-color: rgba(0, 123, 255, 0.1);
	}
	.wrestler-brand-toggle-container input[type='radio']:checked + .inner.brand-awl {
		border-color: var(--awl);
		background-color: rgba(164, 63, 184, 0.1);
	}

	.wrestler-brand-toggle-container .inner img {
		display: block;
		object-fit: contain;
	}

	@media only screen and (max-width: 768px) {
		.button-container.fixed {
			padding: 10px;
		}
		.button-container.fixed .button-content {
			padding: 0;
		}
	}
</style>
