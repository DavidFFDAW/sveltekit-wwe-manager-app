<script lang="ts">
	import PageWrapper from '$lib/components/page-wrapper/page-wrapper.svelte';
	import EditorForm from './components/editor-form.svelte';
	const templateImage = 'https://davidfernandezdeveloper.es/2k/images/cody-rhodes.webp';
	export let data = { wrestlers: [] };
</script>

<PageWrapper page="wrestler-image-editor">
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
</PageWrapper>
