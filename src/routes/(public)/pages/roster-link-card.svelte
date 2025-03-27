<script lang="ts">
	import { errorimage } from '$lib/actions/error.image';

	export let href: string;
	export let title: string;
	export let description: string;
	export let image: string;
	export let position: string = 'center';
</script>

<a class="card roster-link-card flex column" {href}>
	<div class="card-image">
		<img use:errorimage src={image} alt={title} class="block" style="object-position: {position}" />
	</div>

	<div class="card-content">
		<h3 class="card-title">{title}</h3>
		<p class="card-content-subtitle">{description}</p>
	</div>
</a>

<style>
	.card {
		width: 100%;
		display: block;
		object-fit: contain;
		border-radius: 5px;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
		overflow: hidden;
	}
	.card .card-image {
		height: 260px;
	}
	.card .card-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	.card .card-content {
		padding: 15px;
	}

	@media only screen and (max-width: 768px) {
		.card {
			max-width: 100%;
		}
	}
</style>
