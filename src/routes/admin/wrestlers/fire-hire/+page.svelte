<script lang="ts">
	import { errorimage } from '$lib/actions/error.image';
	import AsyncForm from '$lib/components/forms/async-form.svelte';
	import SimplePagination from '$lib/components/visual/simple-pagination.svelte';

	let { data } = $props();
	let wrestlers = $state(data.list);
	$effect(() => {
		wrestlers = data.list.map((wrestler) => wrestler);
	});
</script>

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
							<span class="id">#{wrestler.id}</span>
						</div>
					</div>

					<div class="status">
						<span class="status-label rumble uppercase">
							{wrestler.hired ? 'Contratado' : 'Despedido'}
						</span>
						<input
							type="hidden"
							name="status[{wrestler.id}]"
							value={wrestler.hired ? 'active' : 'released'}
						/>
						<label class="toggle" aria-label="Cambiar estado contratación">
							<input
								type="checkbox"
								name="toggle[{wrestler.id}]"
								value="true"
								bind:checked={wrestler.hired}
							/>
							<span class="slider">
								<i class="bi bi-{wrestler.hired ? 'check' : 'x'} icon"></i>
							</span>
						</label>
					</div>
				</li>
			{/each}
		</ul>

		<div class="button-container fixed">
			<div class="button-content">
				<p>Pagina {data.wrestlers.currentPage} de {data.wrestlers.pages}</p>
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
		box-shadow: 0 0px 3px rgba(0, 0, 0, 0.2);
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
	.status {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		gap: 10px;
	}

	.status-label {
		font-size: 10px;
		font-weight: 600;
		letter-spacing: 0.02em;
		user-select: none;
		padding: 6px 10px;
		border-radius: 999px;
		border: 1px solid #ddd;
		background: rgba(255, 255, 255, 0.03);
		color: #333;
		/* min-width: 112px; */
		text-align: center;
		transition:
			background 0.18s ease,
			color 0.18s ease,
			border-color 0.18s ease;
	}

	.toggle {
		position: relative;
		width: 54px;
		height: 30px;
		display: inline-block;
		cursor: pointer;
	}

	.toggle input {
		position: absolute;
		inset: 0;
		opacity: 0;
		cursor: pointer;
	}

	.slider {
		position: absolute;
		inset: 0;
		border-radius: 999px;
		background: rgba(224, 82, 82, 0.35);
		border: 1px solid rgba(224, 82, 82, 0.55);
		transition:
			background 0.18s ease,
			border-color 0.18s ease;
		box-shadow: inset 0 0 0 2px rgba(0, 0, 0, 0.12);
	}

	.slider::after {
		content: '';
		position: absolute;
		top: 50%;
		left: 3px;
		width: 24px;
		height: 24px;
		border-radius: 999px;
		transform: translateY(-50%);
		background: rgba(255, 255, 255, 0.92);
		transition: left 0.18s ease;
		box-shadow: 0 8px 18px rgba(0, 0, 0, 0.25);
	}
	.slider i.icon {
		position: absolute;
		top: 50%;
		left: 0;
		width: 16px;
		height: 16px;
		transform: translate(50%, -50%);
		color: rgba(0, 0, 0, 0.8);
		border-radius: 50%;
		transition: left 0.18s ease;
		z-index: 1;
	}

	/* Checked = contratado (verde) */
	.toggle input:checked + .slider {
		background: rgba(31, 191, 114, 0.3);
		border-color: rgba(31, 191, 114, 0.6);
	}

	.toggle input:checked + .slider::after {
		left: 27px;
	}
	.toggle input:checked + .slider i.icon {
		left: 23px;
	}
</style>
