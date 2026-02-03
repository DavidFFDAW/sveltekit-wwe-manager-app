<script lang="ts">
	import { errorimage } from '$lib/actions/error.image';
	import AsyncForm from '$lib/components/forms/async-form.svelte';
	import SimplePagination from '$lib/components/visual/simple-pagination.svelte';
	import type { Wrestler } from '@prisma/client';

	let { data } = $props();
</script>

<div class="page-content down">
	<AsyncForm method="post" showButtons={false}>
		<ul>
			{#each data.list as wrestler}
				<li class="row wrestler-item">
					<div class="id">#{wrestler.id}</div>
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
						<span>WWE Superstar</span>
					</div>

					<div class="status">
						<span class="status-label rumble uppercase"
							>{wrestler.hired ? 'Contratado' : 'Despedido'}</span
						>
						<input
							type="hidden"
							name="status[{wrestler.id}]"
							value={wrestler.hired ? 'active' : 'released'}
						/>
						<label class="toggle" aria-label="Cambiar estado contratación">
							<input
								type="checkbox"
								name="hired"
								value="true"
								checked={wrestler.hired}
								onchange={handleHired(wrestler)}
							/>
							<span class="slider"></span>
						</label>
					</div>
				</li>
			{/each}
		</ul>

		<button type="submit" class="btn primary fixed-button">Guardar cambios</button>
	</AsyncForm>

	<SimplePagination current={data.wrestlers.currentPage} pages={data.wrestlers.pages} />
</div>

<style>
	.fixed-button {
		position: fixed;
		bottom: 20px;
		right: 20px;
		background: #1fbf72;
		box-shadow: 0 8px 18px rgba(31, 191, 114, 0.35);
		z-index: 10;
	}
	.page-content {
		max-width: 600px;
		margin: 0 auto;
		padding: 1rem 0;
	}
	ul {
		list-style: none;
		margin: 0;
		padding: 0;
		border: 1px solid #444c56;
		background: #fff;
		border-radius: 12px;
		overflow: hidden;
	}
	.row {
		display: grid;
		grid-template-columns: 90px 64px 1fr 190px;
		align-items: center;
		gap: 12px;
		padding: 12px 14px;
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
		display: flex;
		flex-direction: column;
		gap: 3px;
		min-width: 0;
	}

	.name strong {
		font-size: 14px;
		white-space: nowrap;
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
		font-size: 12px;
		font-weight: 600;
		letter-spacing: 0.02em;
		user-select: none;
		padding: 6px 10px;
		border-radius: 999px;
		border: 1px solid #ddd;
		background: rgba(255, 255, 255, 0.03);
		color: #333;
		min-width: 112px;
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

	/* Checked = contratado (verde) */
	.toggle input:checked + .slider {
		background: rgba(31, 191, 114, 0.3);
		border-color: rgba(31, 191, 114, 0.6);
	}

	.toggle input:checked + .slider::after {
		left: 27px;
	}

	/* Responsive: apilar */
	@media (max-width: 780px) {
		.row {
			grid-template-columns: 90px 54px 1fr;
			grid-template-areas:
				'id avatar name'
				'gender gender status';
			align-items: start;
		}

		.row > .id {
			grid-area: id;
			padding-top: 8px;
		}

		.row > .avatar {
			grid-area: avatar;
		}

		.row > .name {
			grid-area: name;
		}

		.row > .status {
			grid-area: status;
			justify-content: flex-start;
		}
	}
</style>
