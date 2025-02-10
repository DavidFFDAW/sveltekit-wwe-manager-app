<script>
	import AsyncButton from '$lib/components/buttons/async-button.svelte';
	import PageWrapper from '$lib/components/page-wrapper/page-wrapper.svelte';
</script>

<PageWrapper page="admin-teams">
	<div class="w1 flex end">
		<AsyncButton
			url="/api/teams/gender/refresh"
			method="post"
			classes="btn cta"
			text="Comprobar géneros de equipos"
			icon="gender-ambiguous"
		/>
	</div>
</PageWrapper>
