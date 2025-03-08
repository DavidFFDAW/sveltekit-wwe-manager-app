<script lang="ts">
	import PageWrapper from '$lib/components/page-wrapper/page-wrapper.svelte';

	export let data;
</script>

<PageWrapper page="admin-subscriptions-panel">
	<div class="subscriptions-panel panel">
		<h1 class="title">Subscriptions</h1>
		<div class="subscriptions-list flex column astart gap-medium total no-overflow">
			{#each data.subscriptions as subscription}
				<div class="subscription box mxw1">
					<div class="subscription-info">
						<p class="overflow-horizontal">{subscription.endpoint}</p>
						<p>{subscription.auth}</p>
						<p>{subscription.p256dh}</p>
						<p>{subscription.created_at?.toLocaleString()}</p>
					</div>
					<div class="subscription-actions">
						<button class="btn">Delete</button>
					</div>
				</div>
			{/each}
		</div>
	</div>
</PageWrapper>
