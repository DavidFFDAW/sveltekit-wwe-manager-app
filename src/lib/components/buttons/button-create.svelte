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
	}

	.create-resource-global-link-wrapper a {
		color: #fff;
		display: block;
		background-color: #537cb6;
		padding: 10px;
		border-radius: 50%;
		font-size: 25px;
	}
</style>
