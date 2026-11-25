<script lang="ts">
	import { page } from '$app/state';
	import LoadButton from '$lib/components/buttons/load-button.svelte';
	import PanelFooter from '$lib/components/navigation/panel-footer.svelte';

	let { children } = $props();
	const links = [
		{ href: '/admin/ppvs', icon: 'list-ul', label: 'PPVs' },
		{ href: '/admin/ppvs/calendar', icon: 'calendar3', label: 'Ver calendario' },
		{ href: '/admin/ppvs/bulk/active', icon: 'list', label: 'Edicion masiva' },
		{ href: '/admin/ppvs/update/calendar', icon: 'calendar-week', label: 'Gestionar calendario' },
		{ href: '/admin/ppvs/create', icon: 'plus-lg', label: 'Crear PPV' }
	];
</script>

<div class="ppvs-layout">
	{@render children()}
	<PanelFooter label="Accesos de PPVs">
		{#each links as link}
			<a href={link.href} aria-current={page.url.pathname === link.href ? 'page' : undefined}>
				<i class="bi bi-{link.icon}" aria-hidden="true"></i>
				{link.label}
			</a>
		{/each}

		<LoadButton
			href="/admin/ppvs/dates"
			class="secondary"
			method="post"
			color="warn"
			icon="calendar2-week"
		>
			Actualizar fechas
		</LoadButton>
	</PanelFooter>
</div>

<style>
	.ppvs-layout {
		--panel-footer-left: var(--sidebar-width, 250px);
	}
	@media (max-width: 768px) {
		.ppvs-layout {
			--panel-footer-left: 0px;
		}
	}
</style>
