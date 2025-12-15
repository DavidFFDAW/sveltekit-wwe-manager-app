<script lang="ts">
	import { errorimage } from '$lib/actions/error.image';
	import SimpleAsyncForm from '$lib/components/forms/simple-async-form.svelte';
	import { Utils } from '$lib/utils/general.utils';
	import type { BlogPost } from '@prisma/client';
	import { fade } from 'svelte/transition';

	let { post }: { post: BlogPost } = $props();
</script>

<div class="wwe-post-card post-card post-{post.id} post-{post.status}" transition:fade>
	<div class="post-card-inner">
		<img src={post.image} alt={post.title} width="150" height="150" use:errorimage />
		<div class="post-card-datas">
			<header class="post-card-title">
				<h2>{post.title}</h2>
				<small>{post.slug}</small>
			</header>
			<p class="post-card-excerpt">{post.exceptr}</p>
			<span class="post-card-badge post-card-date"
				>{Utils.getDateLocale(post.created_at as Date)}</span
			>
			<span class="post-card-badge post-card-views">{post.views} visitas</span>
		</div>
	</div>

	<SimpleAsyncForm classes="w1 blog-post-card-actions" updateId={post.id} method="post">
		<footer class="blog-post-card-actions actions-buttons">
			<button class="btn small info rounded icon icon-gap-5" formaction="?/toggleVisibility">
				<i class="bi bi-{post.visible ? 'eye-slash' : 'eye'}"></i>
				<span>{post.visible ? 'Despublicar' : 'Publicar'} post </span>
			</button>

			<button
				class="btn small danger rounded icon icon-gap-5"
				formaction="?/delete"
				data-confirm="true"
				data-confirm-message="¿Estás seguro de que deseas eliminar este post? Esta acción no se puede deshacer."
			>
				<i class="bi bi-trash3-fill"></i>
				<span>Eliminar este post</span>
			</button>

			<a href={`/admin/blog/update/${post.id}`} class="btn small warn rounded icon icon-gap-5">
				<i class="bi bi-pencil"></i>
				<span>Editar este post</span>
			</a>
		</footer>
	</SimpleAsyncForm>
</div>

<style>
	.wwe-post-card.post-card {
		width: 100%;
		position: relative;
		background-color: #fff;
		border: 1px solid #ddd;
		border-radius: 8px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		padding: 16px;
		font-family: 'sourcesans', sans-serif;
		overflow: hidden;
	}
	.wwe-post-card.post-card .post-card-inner {
		display: flex;
		align-items: flex-start;
		gap: 16px;
	}
	.wwe-post-card.post-card .post-card-inner img {
		width: 150px;
		height: 150px;
		object-fit: cover;
		border-radius: 5px;
	}
	.wwe-post-card.post-card .post-card-inner .post-card-datas {
		flex: 1;
		width: 100%;
		max-width: 80%;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}
	.wwe-post-card.post-card .post-card-inner .post-card-datas .post-card-title {
		padding-bottom: 12px;
	}
	.wwe-post-card.post-card .post-card-inner .post-card-datas .post-card-title h2 {
		max-width: 100%;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		text-transform: uppercase;
		font-size: 20px;
		transform: scaleY(1.2);
	}
	.wwe-post-card.post-card .post-card-inner .post-card-datas .post-card-title small {
		color: #666;
		display: block;
		font-size: 13px;
		margin-top: -2px;
	}
	.wwe-post-card.post-card .post-card-inner .post-card-datas .post-card-excerpt {
		height: 100%;
		flex-grow: 1;
		color: #666;
		font-size: 16px;
		text-overflow: ellipsis;
	}
	.wwe-post-card.post-card .post-card-inner .post-card-datas .post-card-badge {
		position: absolute;
		font-size: 0.85rem;
		font-weight: 800;
		color: #555;
		background-color: rgba(197, 197, 197, 0.7);
		border: 1px solid #ccc;
		/* glassmorphism */
		backdrop-filter: blur(1px);
		-webkit-backdrop-filter: blur(1px);
		padding: 4px 10px;
		border-radius: 50px;
		box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
	}
	.wwe-post-card.post-card .post-card-inner .post-card-datas .post-card-date {
		top: 10px;
		right: 10px;
	}
	.wwe-post-card.post-card .post-card-inner .post-card-datas .post-card-views {
		top: 10px;
		left: 10px;
		color: #333;
	}
	.wwe-post-card.post-card .blog-post-card-actions {
		margin-top: 10px;
		padding-top: 10px;
		border-top: 2px solid #eee;
		flex-wrap: wrap;
		display: flex;
		justify-content: flex-end;
		gap: 10px;
	}
	.wwe-post-card.post-card .blog-post-card-actions > * {
		flex-shrink: 0;
	}
	.wwe-post-card.post-card.post-draft .post-card-inner,
	.wwe-post-card.post-card.post-unpublished .post-card-inner {
		filter: grayscale(100%);
		opacity: 0.5;
	}

	@media only screen and (max-width: 768px) {
		.wwe-post-card.post-card .post-card-inner {
			align-items: flex-start;
			flex-direction: column;
		}
		.wwe-post-card.post-card .post-card-inner img {
			width: 100%;
			height: auto;
			max-height: 150px;
		}
		.wwe-post-card.post-card .post-card-inner .post-card-datas {
			max-width: 100%;
		}
		.wwe-post-card.post-card .post-card-inner .post-card-datas .post-card-title h2 {
			font-size: 18px;
			white-space: normal;
			overflow: visible;
		}
		.wwe-post-card.post-card .post-card-inner .post-card-datas .post-card-title small {
			display: none;
		}

		.wwe-post-card.post-card .post-card-inner .post-card-datas .post-card-excerpt {
			font-size: 12px;
			text-align: justify;
		}

		.wwe-post-card.post-card .blog-post-card-actions {
			justify-content: space-between;
			align-items: center;
		}
		.wwe-post-card.post-card .blog-post-card-actions > * {
			flex-grow: 1;
		}
	}
</style>
