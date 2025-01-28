<script>
	import Icon from '../icons/icon.svelte';

	export let endpoint = '';
</script>

<div class="create-resource-global-link-wrapper">
	<a href={`/admin/${endpoint.startsWith('/') ? endpoint.slice(1) : endpoint}`}>
		<Icon icon="plus" />
	</a>
</div>

<style>
	.create-resource-global-link-wrapper {
		position: fixed;
		bottom: 20px;
		right: 20px;
		font-size: 25px;
		background-color: var(--blue);
		border-radius: 50%;
		color: #fff;
		width: 50px;
		height: 50px;
		display: flex;
		justify-content: center;
		align-items: center;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
	}

	.create-resource-global-link-wrapper a {
		display: block;
	}
</style>
