<script lang="ts">
	import { errorimage } from '$lib/actions/error.image.js';
	import AsyncForm from '$lib/components/forms/async-form.svelte';
	import { Utils } from '$lib/utils/general.utils';
	import { ReignUtils } from '$lib/utils/reign.utils';

	export let data;
	let parsedReigns = [];
	let today = new Date();

	const formatDate = (date: Date | null) => {
		if (!date) return '';
		const diff = today.getTime() - date.getTime();
		const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));
		const diffHours = Math.floor(diff / (1000 * 60 * 60));
		const diffMinutes = Math.floor(diff / (1000 * 60));

		if (diffDays > 5) return Utils.formatDate(date);
		if (diffDays > 1) return `hace ${diffDays} días`;
		if (diffDays === 1) return 'hace 1 día';
		if (diffHours > 1) return `hace ${diffHours} horas`;
		if (diffHours === 1) return 'hace 1 hora';
		if (diffMinutes > 1) return `hace ${diffMinutes} minutos`;
		if (diffMinutes === 1) return 'hace 1 minuto';
		return 'hace unos minutos';
	};

	$: parsedReigns = data.reigns.map((reign) => ({
		...reign,
		updatedAt: formatDate(reign.updated_at),
		createdAt: Utils.formatDate(reign.created_at)
	}));
</script>

<div class="title">
	<h1>Defensas titulares</h1>
	<div class="flex column astart nogap">
		<small>Elige los reinados y actualiza las defensas titulares.</small>
		<small>
			Ten en cuenta que solo se contarán las defensas exitosas y que por tanto, si un luchador
			pierde el título en su primera defensa, no se contará ninguna defensa.
		</small>
	</div>
	<div class="w1 flex end acenter">
		<a href="/admin/championship-reigns/defences/update" class="btn small cta">
			Actualizar días de defensas titulares
		</a>
	</div>
</div>

<AsyncForm action="updateDefences" method="post" classes="down" buttonText="Actualizar defensas">
	<div class="reign-defences-list grid grid-two-column gap-small responsive">
		{#each parsedReigns as reign}
			<div class="reign-defences-list-item relative">
				<input type="checkbox" name="reigns[]" value={reign.id} class="app-checkbox" />
				<div class="inner checkbox-inner box h1">
					<div class="w1 h1 flex center column acenter reign-defences-list-item-header">
						<div
							class="images-container relative {reign.Partner
								? 'grid two-column-grid'
								: 'flex center'}"
						>
							<img
								src={reign.Wrestler.image_name as string}
								alt={reign.Wrestler.name}
								use:errorimage={'/vacant.webp'}
							/>
							{#if reign.Championship.tag && reign.Partner}
								<img
									src={reign.Partner.image_name as string}
									alt={reign.Partner.name}
									use:errorimage={'/vacant.webp'}
								/>
							{/if}
						</div>
						<h2>{ReignUtils.getWrestlerOrTeamName(reign as any)}</h2>
						<small>{reign.Championship.name}</small>
						<img
							width="100"
							height="100"
							src={reign.Championship.image as string}
							alt={reign.Championship.name}
							use:errorimage={'/unknown-championship.webp'}
						/>
						{#if reign.defences && reign.defences > 0}
							<small>{reign.defences} defensas</small>
						{/if}
						<p>Creado: {reign.createdAt}</p>
						<p>Actualizado: {reign.updatedAt}</p>
					</div>
				</div>
			</div>
		{/each}
	</div>
</AsyncForm>

<style>
	.app-checkbox:checked + .inner {
		border: 2px solid var(--blue);
	}

	.images-container {
		position: relative;
		width: 250px;
		height: auto;
	}

	.images-container img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
</style>
