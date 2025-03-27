<script lang="ts">
	import MainHeader from '$lib/components/headers/main-header.svelte';
	import PageWrapper from '$lib/components/page-wrapper/page-wrapper.svelte';
	import RosterLinkCard from './roster-link-card.svelte';
</script>

<PageWrapper page="pages-container">
	<MainHeader
		title="Paginas importantes"
		background="https://i0.wp.com/mundolucha.com/wp-content/uploads/2025/03/resultados-wwe-nxt-25-de-marzo-de-2025-mundolucha.jpg"
		mobileBackground="https://i0.wp.com/mundolucha.com/wp-content/uploads/2025/03/resultados-wwe-nxt-25-de-marzo-de-2025-mundolucha.jpg"
		titlePosition="center"
		bgPosition="center"
	/>

	<div class="w1 grid responsive roster-preselection-panel">
		<RosterLinkCard
			href="/roster"
			title="Roster Individual"
			description="Consulta la lista de luchadores y las marcas a las que pertenecen"
			image="https://wallpapers.com/images/hd/cody-rhodes-wwe-entrance-28rxfrklndc7ho1n.jpg"
		/>
		<RosterLinkCard
			href="/roster/teams"
			title="Roster de Equipos"
			description="Consulta la lista de luchadores por equipos y las marcas a las que pertenecen"
			image="https://cdn.vox-cdn.com/thumbor/mUGuHEEW4p-svnOx9lUQ2o498ls=/0x0:1200x675/1200x800/filters:focal(504x242:696x434)/cdn.vox-cdn.com/uploads/chorus_image/image/72399318/006_SD_06232023HM_12156__133c69be3c4cebf97509d66f32ccbb27.0.jpg"
			position="top"
		/>

		<RosterLinkCard
			href="/champions"
			title="Campeones actuales"
			description="Consulta la lista de campeones actuales registrados"
			image="https://www.wwe.com/f/styles/gallery_img_l/public/all/2024/01/089_RR_01272027CA_48434--08dea04fc07a4eb88fd70879b50249b6.jpg"
		/>

		<RosterLinkCard
			href="/champions/ranking"
			title="Ranking"
			description="Consulta el ranking de luchadores por campeonatos"
			image="https://www.wwe.com/f/styles/gallery_img_l/public/all/2023/05/010_SUR_11222020EJ_45261--c27202041f27ee5ca59d53374ce3d891.jpg"
			position="top"
		/>

		<RosterLinkCard
			href="/champions/ranking/championships"
			title="Ranking por títulos"
			description="Consulta el ranking de luchadores por títulos ganados"
			image="https://i.pinimg.com/736x/6d/9d/de/6d9ddeed7c0344b6b345658dbaf32b26.jpg"
			position="top"
		/>

		<RosterLinkCard
			href="/champions/history"
			title="Histórico por títulos"
			description="Consulta el histórico de títulos ganados por luchador"
			image="https://wallpapers.com/images/hd/rhea-ripley-champion-belt-pose-nk4g9jl3rcgsk5tr.jpg"
			position="top"
		/>

		<RosterLinkCard
			href="/ppvs"
			title="PPVs"
			description="Consulta la lista de próximos PPVs y eventos especiales"
			image="https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Wrestlemania35live.jpg/640px-Wrestlemania35live.jpg"
		/>
	</div>
</PageWrapper>

<style>
	.roster-preselection-panel {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
		gap: 20px;
	}

	.roster-preselection-panel {
		min-height: 50vh;
		flex-direction: column;
	}

	@media only screen and (max-width: 768px) {
		.roster-preselection-panel {
			grid-template-columns: repeat(1, 1fr);
		}
	}
</style>
