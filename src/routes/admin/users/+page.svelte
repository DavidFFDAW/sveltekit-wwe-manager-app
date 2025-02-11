<script lang="ts">
	import { errorimage } from '$lib/actions/error.image';
	import ButtonCreate from '$lib/components/buttons/button-create.svelte';
	import PageWrapper from '$lib/components/page-wrapper/page-wrapper.svelte';

	export let data = { users: [] };
</script>

<PageWrapper page="admin-users">
	<div class="w1 flex column gap-medium">
		{#each data.users as user}
			<div class="w1 box flex gap-small">
				<img width="85" src={user.image} alt={user.name} use:errorimage />

				<div class="w1 card-body flex column gap-smaller astart">
					<h5 class="card-title">{user.name}</h5>
					<div class="w1 flex column gap-5 astart">
						<p class="card-text">{user.email}</p>
						<a href="/admin/users/update/{user.id}" class="btn btn-secondary">Editar</a>
					</div>
				</div>
			</div>
		{/each}
	</div>

	<ButtonCreate endpoint="/users/create" />
</PageWrapper>
