<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import type { PPV } from '@prisma/client';
	import { Toast } from '$lib/utils/toast.helper';

	let { ppv }: { ppv: PPV } = $props();
	let pending = $state(false);
	const submit: SubmitFunction = ({ submitter, cancel }) => {
		if (pending) {
			cancel();
			return;
		}
		if (
			submitter?.dataset.action === 'delete' &&
			!confirm(`¿Eliminar ${ppv.name}? Esta acción no se puede deshacer.`)
		) {
			cancel();
			return;
		}
		pending = true;
		return async ({ result, update }) => {
			try {
				if (result.type === 'failure' || result.type === 'error') {
					const message = result.type === 'failure' ? result.data?.message : undefined;
					Toast.error(
						typeof message === 'string' ? message : 'No se ha podido completar la acción.'
					);
				} else {
					await update({ reset: false });
					if (result.type === 'success')
						Toast.success(
							typeof result.data?.message === 'string' ? result.data.message : 'PPV actualizado.'
						);
				}
			} finally {
				pending = false;
			}
		};
	};
</script>

<form
	method="post"
	action="?/toggleActive"
	use:enhance={submit}
	aria-label="Acciones de {ppv.name}"
	aria-busy={pending}
>
	<input type="hidden" name="_update_id" value={ppv.id} />
	<a class="edit" href="/admin/ppvs/update/{ppv.id}" aria-label="Editar {ppv.name}"
		><i class="bi bi-pencil" aria-hidden="true"></i> Editar</a
	>
	<button
		type="submit"
		formaction="?/toggleActive"
		disabled={pending}
		aria-label="{ppv.active ? 'Desactivar' : 'Activar'} {ppv.name}"
		><i class="bi bi-{ppv.active ? 'toggle-on' : 'toggle-off'}" aria-hidden="true"></i>{ppv.active
			? 'Desactivar'
			: 'Activar'}</button
	>
	<button
		class="delete"
		type="submit"
		formaction="?/deletePPV"
		data-action="delete"
		disabled={pending}
		aria-label="Eliminar {ppv.name}"><i class="bi bi-trash" aria-hidden="true"></i> Eliminar</button
	>
</form>

<style>
	form {
		display: flex;
		flex-wrap: wrap;
		gap: 0.45rem;
		width: 100%;
	}
	a,
	button {
		display: inline-flex;
		justify-content: center;
		align-items: center;
		gap: 0.4rem;
		flex: 1 1 auto;
		min-height: 42px;
		padding: 0.55rem 0.6rem;
		border: 1px solid var(--border, #e0e4e9);
		border-radius: 7px;
		background: var(--surface2, #f3f5f8);
		color: var(--text, #475569);
		font-size: 0.78rem;
		font-weight: 600;
		cursor: pointer;
	}
	.edit {
		background: var(--surface, #fff);
	}
	a:hover,
	button:hover:not(:disabled) {
		border-color: var(--muted, #aab3c1);
		background: var(--surface2, #e8edf3);
	}
	.delete {
		background: transparent;
		border-color: transparent;
		color: var(--danger, #b42332);
	}
	.delete:hover:not(:disabled) {
		background: #fde7e7;
		border-color: #f3c2c7;
		color: #a11b29;
	}
	button:disabled {
		opacity: 0.5;
		cursor: wait;
	}
	a:focus-visible,
	button:focus-visible {
		outline: 2px solid var(--blue);
		outline-offset: 3px;
	}
</style>
