<script lang="ts">
	import PageWrapper from '$lib/components/page-wrapper/page-wrapper.svelte';
	import EditorForm from './components/editor-form.svelte';
	const templateImage = 'https://davidfernandezdeveloper.es/2k/images/cody-rhodes.webp';
	export let data = { wrestlers: [], hasApiToken: true };
</script>

<PageWrapper page="wrestler-image-editor">
	{#if data.hasApiToken}
		<EditorForm
			{templateImage}
			resourceList={data.wrestlers.map((wrestler) => ({
				id: wrestler.id,
				name: wrestler.name,
				image: wrestler.image_name?.toString() || '',
				status: wrestler.status
			}))}
		>
			<input type="hidden" name="type" value="wrestler" />
		</EditorForm>
	{:else}
		<div class="fixed w1 h1 popup flex center acenter">
			<h1>Editor de imagenes</h1>
			<p>API token is required to access this page</p>
		</div>
	{/if}
</PageWrapper>

<style>
	.popup {
		background-color: rgba(0, 0, 0, 0.5);
		color: white;
	}
</style>
