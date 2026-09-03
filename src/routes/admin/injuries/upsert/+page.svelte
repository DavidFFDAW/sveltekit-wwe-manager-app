<script lang="ts">
	import AsyncForm from '$lib/components/forms/async-form.svelte';
	import { errorimage } from '$lib/actions/error.image';
	const today = new Date().toISOString().split('T')[0];

	let { data } = $props();
	let isCreate = data.injury_upsert.isCreate;
	let isUpdate = !isCreate;

	let wrestlers = data.injury_upsert.wrestlers;
	let injuryData = data.injury_upsert.injury;

	const severityOptions = [
		{
			value: 'low',
			label: 'Leve',
			className: 'low',
			description: 'Lesión menor, recuperación relativamente rápida.'
		},
		{
			value: 'medium',
			label: 'Moderada',
			className: 'medium',
			description: 'Requiere varias semanas fuera de competición.'
		},
		{
			value: 'high',
			label: 'Grave',
			className: 'high',
			description: 'Baja prolongada o lesión de especial relevancia.'
		}
	];

	const formatDate = (value: string | Date | undefined | null) => {
		if (!value) return '-';
		const strDate = value instanceof Date ? value.toISOString().split('T')[0] : value;
		const [year, month, day] = strDate.split('-');
		return `${day}/${month}/${year}`;
	};

	const getInitials = (name = '') =>
		name
			.split(' ')
			.filter(Boolean)
			.slice(0, 2)
			.map((part) => part[0]?.toUpperCase())
			.join('');

	let searchTerm = $state('');
	let selectedWrestlerId = $state<number | null>(injuryData.wrestler_id || null);
	let postData = $state({
		title: '',
		excerpt: '',
		createPost: false
	});

	let filteredWrestlers = $derived.by(() => {
		const term = searchTerm.trim().toLowerCase();
		if (!term) return wrestlers;

		return wrestlers.filter((wrestler) =>
			[wrestler.name, wrestler.brand, wrestler.status].join(' ').toLowerCase().includes(term)
		);
	});

	let selectedWrestler = $derived(
		wrestlers.find((wrestler) => wrestler.id === selectedWrestlerId) || null
	);
	let selectedSeverity = $derived(
		severityOptions.find((option) => option.value === injuryData.severity) || severityOptions[1]
	);
	let durationLabel = $derived.by(() => {
		if (!injuryData.start_date || !injuryData.end_date) return '-';

		const start = new Date(`${injuryData.start_date}T00:00:00`);
		const end = new Date(`${injuryData.end_date}T00:00:00`);
		const diff = Math.round((end.getTime() - start.getTime()) / 86400000);

		return diff >= 0 ? `${diff} días` : 'Fecha final no válida';
	});

	$effect(() => {
		if (selectedWrestler && isCreate && !postData.title.trim()) {
			postData.title = `${selectedWrestler.name} estará de baja por lesión`;
		}
	});

	$effect(() => {
		if (selectedWrestler && isCreate && injuryData.name && !postData.excerpt.trim()) {
			postData.excerpt = `${selectedWrestler.name} estará alejado de la competición tras sufrir ${injuryData.name.toLowerCase()}.`;
		}
	});
</script>

<div class="injury-upsert-page">
	<header class="page-header injury-header">
		<div>
			<span class="eyebrow">Gestión médica</span>
			<h1>{!isCreate ? 'Editar lesión' : 'Registrar lesión'}</h1>
			<p>
				Añade la lesión al historial del luchador, define su periodo estimado de baja y deja
				preparada la información editorial si quieres publicarla en el blog.
			</p>
		</div>

		<div class="header-actions">
			<a href="/admin/injuries" class="btn secondary">
				<i class="bi bi-arrow-left"></i>
				<span>Volver al listado</span>
			</a>
		</div>
	</header>

	<section class="injury-layout">
		<AsyncForm
			action="upsert"
			redirect="/admin/injuries"
			buttonText={isUpdate ? 'Actualizar lesión' : 'Guardar lesión'}
			updateId={injuryData.id || ''}
			showButtons={false}
			classes="injury-form-card"
		>
			<section class="injury-section">
				<div class="section-header">
					<div class="section-number">1</div>
					<div>
						<h2>Luchador lesionado</h2>
						<p>Selecciona al luchador al que corresponde la lesión.</p>
					</div>
				</div>

				<div class="selector-panel">
					<div class="selector-toolbar">
						<label class="search-field">
							<i class="bi bi-search"></i>
							<input
								type="search"
								bind:value={searchTerm}
								placeholder="Buscar luchador por nombre, marca o estado..."
							/>
						</label>
					</div>

					<div class="selector-meta">
						<span>{filteredWrestlers.length} luchadores disponibles</span>
						<span>{selectedWrestler ? '1 seleccionado' : 'Sin selección'}</span>
					</div>

					<div class="wrestler-list">
						{#each filteredWrestlers as wrestler}
							<label class="wrestler-row">
								<input
									type="radio"
									name="wrestler_id"
									value={wrestler.id}
									bind:group={selectedWrestlerId}
									required
								/>
								<div class="wrestler-row-inner">
									<div class="avatar">
										{#if wrestler.image_name}
											<img
												src={wrestler.image_name}
												alt={wrestler.name}
												use:errorimage={'/vacant.webp'}
											/>
										{:else}
											{getInitials(wrestler.name)}
										{/if}
									</div>
									<div class="wrestler-info">
										<strong>{wrestler.name}</strong>
										<span>{wrestler.brand || 'Sin marca'} · {wrestler.status || 'Activo'}</span>
									</div>
									<div class="select-check">
										<i class="bi bi-check-lg"></i>
									</div>
								</div>
							</label>
						{/each}
					</div>
				</div>
			</section>

			<section class="injury-section">
				<div class="section-header">
					<div class="section-number">2</div>
					<div>
						<h2>Datos de la lesión</h2>
						<p>Indica qué lesión se ha producido y su gravedad estimada.</p>
					</div>
				</div>

				<div class="form-grid">
					<label class="field field-full">
						<span>Nombre de la lesión</span>
						<input
							type="text"
							name="injury"
							bind:value={injuryData.name}
							placeholder="Ej. Rotura del ligamento cruzado anterior"
							maxlength="255"
							required
						/>
						<small>
							Usa una descripción clara que pueda mostrarse directamente en el historial.
						</small>
					</label>

					<div class="field field-full">
						<span class="field-label">Gravedad</span>

						<div class="severity-grid">
							{#each severityOptions as option}
								<label class="severity-option {option.className}">
									<input
										type="radio"
										name="severity"
										value={option.value}
										bind:group={injuryData.severity}
										required
									/>
									<div class="severity-card">
										<strong>{option.label}</strong>
										<span>{option.description}</span>
									</div>
								</label>
							{/each}
						</div>
					</div>
				</div>
			</section>

			<section class="injury-section">
				<div class="section-header">
					<div class="section-number">3</div>
					<div>
						<h2>Periodo de baja</h2>
						<p>Estas fechas se utilizarán para controlar automáticamente la recuperación.</p>
					</div>
				</div>

				<div class="form-grid">
					<label class="field">
						<span>Fecha de inicio</span>
						<input type="date" name="start_date" bind:value={injuryData.start_date} required />
					</label>

					<label class="field">
						<span>Fecha prevista de recuperación</span>
						<input type="date" name="end_date" bind:value={injuryData.end_date} required />
					</label>
				</div>

				<div class="date-hint">
					<i class="bi bi-clock-history"></i>
					<span>
						Cuando se alcance la fecha final, el cron podrá detectar la recuperación y notificarla.
						El campo <code>is_notified</code> evita repetir el aviso.
					</span>
				</div>

				<div class="status-row">
					<div class="status-tile">
						<span>Estado de notificación</span>
						<strong>
							<span
								class="pill"
								class:done={injuryData.is_notified}
								class:pending={!injuryData.is_notified}
							>
								{injuryData.is_notified ? 'Notificada' : 'Pendiente'}
							</span>
						</strong>
						<input type="hidden" name="is_notified" value={injuryData.is_notified ? '1' : '0'} />
					</div>

					<div class="status-tile">
						<span>Duración estimada</span>
						<strong>{durationLabel}</strong>
					</div>
				</div>
			</section>

			<section class="injury-section">
				<div class="section-header">
					<div class="section-number">4</div>
					<div>
						<h2>Publicación en el blog</h2>
						<p>Opcionalmente puedes preparar una noticia a partir de esta lesión.</p>
					</div>
				</div>

				<div class="switch-card">
					<div class="switch-copy">
						<strong>Crear post automáticamente</strong>
						<span>
							Si lo activas, el formulario enviará el título y resumen sugeridos para enlazarlo con
							el flujo editorial.
						</span>
					</div>

					<label class="switch">
						<input
							type="checkbox"
							name="create_post"
							value="1"
							bind:checked={postData.createPost}
						/>
						<span class="slider"></span>
					</label>
				</div>

				{#if postData.createPost}
					<div class="blog-options">
						<div class="form-grid">
							<label class="field field-full">
								<span>Título sugerido</span>
								<input type="text" name="post_title" bind:value={postData.title} maxlength="255" />
							</label>

							<label class="field field-full">
								<span>Resumen / introducción</span>
								<textarea
									name="post_excerpt"
									bind:value={postData.excerpt}
									placeholder="Texto introductorio de la noticia..."
								></textarea>
							</label>
						</div>

						<div class="status-row">
							<div class="status-tile">
								<span>Post vinculado</span>
								<strong>
									<span
										class="pill"
										class:linked={injuryData.post_id}
										class:pending={!injuryData.post_id}
									>
										{injuryData.post_id ? 'Ya vinculado' : 'Se creará al guardar'}
									</span>
								</strong>
							</div>

							<div class="status-tile">
								<span>post_id</span>
								<strong>{injuryData.post_id || 'Autogenerado'}</strong>
							</div>
						</div>
					</div>
				{/if}
			</section>

			<footer class="form-actions">
				<a href="/admin/injuries" class="btn secondary">Cancelar</a>
				<button type="submit" class="btn cta">
					<i class="bi bi-save"></i>
					<span>{isUpdate ? 'Actualizar lesión' : 'Guardar lesión'}</span>
				</button>
			</footer>
		</AsyncForm>

		<aside class="side-card">
			<div class="side-hero">
				<div class="side-icon">
					<i class="bi bi-heart-pulse"></i>
				</div>
				<span>Resumen</span>
				<h2>{isUpdate ? 'Lesión existente' : 'Nueva lesión'}</h2>
			</div>

			<div class="side-body">
				<article class="selected-wrestler">
					<div class="avatar">
						{#if selectedWrestler?.image_name}
							<img
								src={selectedWrestler.image_name}
								alt={selectedWrestler.name}
								use:errorimage={'/vacant.webp'}
							/>
						{:else}
							{selectedWrestler ? getInitials(selectedWrestler.name) : '?'}
						{/if}
					</div>
					<div>
						<strong>{selectedWrestler?.name || 'Selecciona un luchador'}</strong>
						<span>{selectedWrestler?.brand || 'Sin marca'}</span>
					</div>
				</article>

				<div class="summary-list">
					<div class="summary-item">
						<span>Lesión</span>
						<strong>{injuryData.name || 'Sin especificar'}</strong>
					</div>

					<div class="summary-item">
						<span>Gravedad</span>
						<strong>{selectedSeverity.label}</strong>
					</div>

					<div class="summary-item">
						<span>Inicio</span>
						<strong>{formatDate(injuryData.start_date)}</strong>
					</div>

					<div class="summary-item">
						<span>Recuperación prevista</span>
						<strong>{formatDate(injuryData.end_date)}</strong>
					</div>

					<div class="summary-item">
						<span>Notificación</span>
						<strong>
							<span
								class="pill"
								class:done={injuryData.is_notified}
								class:pending={!injuryData.is_notified}
							>
								{injuryData.is_notified ? 'Notificada' : 'Pendiente'}
							</span>
						</strong>
					</div>

					<div class="summary-item">
						<span>Blog</span>
						<strong>{postData.createPost ? 'Crear publicación' : 'No generar publicación'}</strong>
					</div>
				</div>

				<div class="cron-note">
					Cuando la lesión finalice, el cron puede marcarla como notificada y enviar el aviso
					correspondiente.
				</div>
			</div>
		</aside>
	</section>
</div>

<style>
	.injury-upsert-page {
		max-width: 1240px;
		margin: 0 auto;
		padding: 0 20px 50px;
		color: #172033;
	}

	.injury-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 24px;
		margin-bottom: 24px;
	}

	.injury-header h1 {
		margin: 12px 0 8px;
		font-size: clamp(30px, 4vw, 42px);
		line-height: 1.05;
	}

	.injury-header p {
		margin: 0;
		max-width: 760px;
		color: #728096;
		line-height: 1.6;
	}

	.eyebrow {
		display: inline-flex;
		align-items: center;
		gap: 7px;
		padding: 7px 12px;
		border-radius: 999px;
		background: #fef2f2;
		color: #b91c1c;
		font-size: 12px;
		font-weight: 900;
		text-transform: uppercase;
	}

	.header-actions {
		display: flex;
		gap: 10px;
		flex-wrap: wrap;
	}

	.injury-layout {
		display: grid;
		grid-template-columns: minmax(0, 1fr) 350px;
		gap: 24px;
		align-items: start;
	}

	:global(.injury-form-card),
	.side-card {
		background: #fff;
		border: 1px solid #e2e8f0;
		border-radius: 8px;
		box-shadow: 0 18px 45px rgba(15, 23, 42, 0.08);
		overflow: hidden;
	}

	:global(.injury-form-card .form-inner-content) {
		padding: 28px;
	}

	.injury-section {
		padding-bottom: 30px;
		margin-bottom: 30px;
		border-bottom: 1px solid #e2e8f0;
	}

	.injury-section:last-of-type {
		border-bottom: 0;
		padding-bottom: 0;
		margin-bottom: 0;
	}

	.section-header {
		display: flex;
		gap: 14px;
		align-items: flex-start;
		margin-bottom: 20px;
	}

	.section-number {
		width: 40px;
		height: 40px;
		border-radius: 8px;
		display: grid;
		place-items: center;
		flex: 0 0 40px;
		background: #111827;
		color: white;
		font-weight: 900;
	}

	.section-header h2 {
		margin: 0 0 5px;
		font-size: 22px;
	}

	.section-header p {
		margin: 0;
		color: #728096;
		line-height: 1.5;
	}

	.selector-panel {
		border: 1px solid #e2e8f0;
		border-radius: 8px;
		overflow: hidden;
	}

	.selector-toolbar {
		padding: 14px;
		background: white;
		border-bottom: 1px solid #e2e8f0;
	}

	.search-field {
		position: relative;
		display: block;
	}

	.search-field i {
		position: absolute;
		left: 15px;
		top: 50%;
		transform: translateY(-50%);
		color: #728096;
		pointer-events: none;
	}

	.search-field input {
		padding-left: 42px;
	}

	.selector-meta {
		padding: 10px 14px;
		display: flex;
		justify-content: space-between;
		gap: 12px;
		background: #f8fafc;
		color: #728096;
		font-size: 13px;
		font-weight: 700;
		border-bottom: 1px solid #e2e8f0;
	}

	.wrestler-list {
		max-height: 320px;
		overflow-y: auto;
	}

	.wrestler-row {
		position: relative;
		display: block;
		cursor: pointer;
	}

	.wrestler-row > input,
	.severity-option input,
	.switch input {
		position: absolute;
		opacity: 0;
		pointer-events: none;
	}

	.wrestler-row-inner {
		display: grid;
		grid-template-columns: 48px minmax(0, 1fr) auto;
		gap: 14px;
		align-items: center;
		padding: 11px 14px;
		border-bottom: 1px solid #e2e8f0;
		transition: 0.15s ease;
	}

	.wrestler-row:last-child .wrestler-row-inner {
		border-bottom: 0;
	}

	.wrestler-row:hover .wrestler-row-inner {
		background: #fafafa;
	}

	.wrestler-row > input:checked + .wrestler-row-inner {
		background: #eff6ff;
		box-shadow: inset 4px 0 0 #2563eb;
	}

	.avatar {
		width: 48px;
		height: 48px;
		border-radius: 8px;
		object-fit: cover;
		background: #e5e7eb;
		overflow: hidden;
		display: grid;
		place-items: center;
		color: #475569;
		font-weight: 900;
		flex: 0 0 48px;
	}

	.avatar img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.wrestler-info {
		min-width: 0;
	}

	.wrestler-info strong {
		display: block;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		margin-bottom: 3px;
	}

	.wrestler-info span {
		display: block;
		color: #728096;
		font-size: 13px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.select-check {
		width: 24px;
		height: 24px;
		display: grid;
		place-items: center;
		border: 2px solid #e2e8f0;
		border-radius: 999px;
		color: transparent;
		font-size: 12px;
		font-weight: 900;
	}

	.wrestler-row > input:checked + .wrestler-row-inner .select-check {
		color: white;
		background: #2563eb;
		border-color: #2563eb;
	}

	.form-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 18px;
	}

	.field {
		display: grid;
		gap: 8px;
	}

	.field-full {
		grid-column: 1 / -1;
	}

	.field > span,
	.field-label {
		font-size: 14px;
		font-weight: 800;
	}

	.field small {
		color: #728096;
		line-height: 1.45;
	}

	input,
	textarea {
		width: 100%;
		border: 1px solid #e2e8f0;
		border-radius: 8px;
		background: #fff;
		padding: 13px 14px;
		color: #172033;
		font: inherit;
	}

	textarea {
		resize: vertical;
		min-height: 100px;
	}

	input:focus,
	textarea:focus {
		outline: none;
		border-color: #2563eb;
		box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.12);
	}

	.severity-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 12px;
	}

	.severity-option {
		position: relative;
		cursor: pointer;
	}

	.severity-card {
		height: 100%;
		border: 2px solid #e2e8f0;
		border-radius: 8px;
		padding: 14px;
		background: #f8fafc;
		transition: 0.15s ease;
	}

	.severity-card strong {
		display: block;
		margin-bottom: 4px;
	}

	.severity-card span {
		display: block;
		color: #728096;
		font-size: 12px;
		line-height: 1.4;
	}

	.severity-option input:checked + .severity-card {
		background: white;
	}

	.severity-option.low input:checked + .severity-card {
		border-color: #16a34a;
		box-shadow: 0 0 0 4px rgba(22, 163, 74, 0.1);
	}

	.severity-option.medium input:checked + .severity-card {
		border-color: #d97706;
		box-shadow: 0 0 0 4px rgba(217, 119, 6, 0.1);
	}

	.severity-option.high input:checked + .severity-card {
		border-color: #dc2626;
		box-shadow: 0 0 0 4px rgba(220, 38, 38, 0.1);
	}

	.date-hint {
		display: flex;
		gap: 10px;
		align-items: flex-start;
		margin-top: 14px;
		padding: 13px 14px;
		border-radius: 8px;
		background: #eff6ff;
		color: #1d4ed8;
		font-size: 13px;
		line-height: 1.45;
	}

	.status-row {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 12px;
		margin-top: 16px;
	}

	.status-tile {
		padding: 14px;
		border-radius: 8px;
		border: 1px solid #e2e8f0;
		background: #f8fafc;
	}

	.status-tile span {
		display: block;
		color: #728096;
		font-size: 12px;
		margin-bottom: 5px;
	}

	.status-tile strong {
		font-size: 14px;
	}

	.pill {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 5px 9px;
		border-radius: 999px;
		font-size: 12px;
		font-weight: 900;
	}

	.pill.pending {
		color: #92400e;
		background: #fef3c7;
	}

	.pill.done {
		color: #166534;
		background: #dcfce7;
	}

	.pill.linked {
		color: #5b21b6;
		background: #ede9fe;
	}

	.switch-card {
		display: flex;
		justify-content: space-between;
		gap: 18px;
		align-items: center;
		padding: 18px;
		border-radius: 8px;
		border: 1px solid #e2e8f0;
		background: #f8fafc;
	}

	.switch-copy strong {
		display: block;
		margin-bottom: 4px;
	}

	.switch-copy span {
		color: #728096;
		font-size: 13px;
		line-height: 1.45;
	}

	.switch {
		position: relative;
		flex: 0 0 auto;
		width: 52px;
		height: 30px;
	}

	.slider {
		position: absolute;
		inset: 0;
		background: #cbd5e1;
		border-radius: 999px;
		transition: 0.2s ease;
	}

	.slider::after {
		content: '';
		position: absolute;
		width: 22px;
		height: 22px;
		left: 4px;
		top: 4px;
		background: white;
		border-radius: 50%;
		box-shadow: 0 2px 7px rgba(15, 23, 42, 0.18);
		transition: 0.2s ease;
	}

	.switch input:checked + .slider {
		background: #7c3aed;
	}

	.switch input:checked + .slider::after {
		transform: translateX(22px);
	}

	.blog-options {
		margin-top: 16px;
		padding: 18px;
		border: 1px solid #ddd6fe;
		border-radius: 8px;
		background: #f5f3ff;
	}

	.form-actions {
		display: flex;
		justify-content: flex-end;
		gap: 12px;
		margin-top: 30px;
		padding-top: 24px;
		border-top: 1px solid #e2e8f0;
	}

	.side-card {
		position: sticky;
		top: 24px;
	}

	.side-hero {
		padding: 28px;
		color: white;
		background:
			radial-gradient(circle at top right, rgba(220, 38, 38, 0.35), transparent 36%),
			linear-gradient(145deg, #151c2d, #0f172a);
	}

	.side-icon {
		width: 64px;
		height: 64px;
		border-radius: 8px;
		display: grid;
		place-items: center;
		margin-bottom: 20px;
		background: linear-gradient(135deg, #fb7185, #dc2626);
		font-size: 30px;
		box-shadow: 0 14px 28px rgba(0, 0, 0, 0.22);
	}

	.side-hero > span {
		display: block;
		margin-bottom: 8px;
		color: #cbd5e1;
		font-size: 12px;
		font-weight: 900;
		text-transform: uppercase;
	}

	.side-hero h2 {
		margin: 0;
		font-size: 26px;
		line-height: 1.15;
	}

	.side-body {
		padding: 24px;
	}

	.selected-wrestler {
		display: flex;
		align-items: center;
		gap: 13px;
		padding: 13px;
		border-radius: 8px;
		background: #f8fafc;
		margin-bottom: 18px;
	}

	.selected-wrestler strong {
		display: block;
		margin-bottom: 3px;
	}

	.selected-wrestler span {
		color: #728096;
		font-size: 13px;
	}

	.summary-list {
		display: grid;
		gap: 14px;
	}

	.summary-item {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 14px;
		padding-bottom: 14px;
		border-bottom: 1px solid #e2e8f0;
	}

	.summary-item span {
		color: #728096;
		font-size: 13px;
	}

	.summary-item strong {
		max-width: 58%;
		font-size: 13px;
		text-align: right;
		overflow-wrap: anywhere;
	}

	.cron-note {
		margin-top: 18px;
		padding: 15px;
		border-radius: 8px;
		background: #fff7ed;
		color: #9a3412;
		font-size: 13px;
		line-height: 1.5;
	}

	@media (max-width: 1180px) {
		.injury-layout {
			grid-template-columns: 1fr;
		}

		.side-card {
			position: static;
		}
	}

	@media (max-width: 800px) {
		.injury-upsert-page {
			padding: 0 12px 40px;
		}

		.injury-header {
			flex-direction: column;
		}

		.header-actions {
			width: 100%;
		}

		.header-actions .btn {
			flex: 1;
		}

		:global(.injury-form-card .form-inner-content) {
			padding: 18px;
		}

		.form-grid,
		.severity-grid,
		.status-row {
			grid-template-columns: 1fr;
		}

		.wrestler-row-inner {
			grid-template-columns: 44px minmax(0, 1fr) 24px;
		}

		.avatar {
			width: 44px;
			height: 44px;
			flex-basis: 44px;
		}

		.form-actions {
			flex-direction: column-reverse;
		}

		.form-actions .btn {
			width: 100%;
		}
	}
</style>
