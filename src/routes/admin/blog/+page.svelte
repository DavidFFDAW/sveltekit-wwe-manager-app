<script lang="ts">
	import { errorimage } from '$lib/actions/error.image';
	import AsyncButton from '$lib/components/buttons/async-button.svelte';
	import ButtonCreate from '$lib/components/buttons/button-create.svelte';
	import ActionsLink from '$lib/components/buttons/grouped-actions/actions-link.svelte';
	import GroupedActions from '$lib/components/buttons/grouped-actions/grouped-actions.svelte';
	import PageWrapper from '$lib/components/page-wrapper/page-wrapper.svelte';
	import type { BlogPost } from '@prisma/client';
	export let data: { posts: BlogPost[] } = { posts: [] };
</script>

<PageWrapper page="admin-blog-page">
	<h1>Administrar Blog</h1>

	<GroupedActions>
		<AsyncButton
			url="/api/blog/slug/refresh"
			method="post"
			text="Regenerar slug de los posts"
			icon="arrow-clockwise"
		/>
		<AsyncButton
			url="/api/blog/slug/refresh"
			method="post"
			text="Regenerar slug de los posts"
			icon="arrow-clockwise"
		/>
		<AsyncButton
			url="/api/blog/slug/refresh"
			method="post"
			text="Regenerar slug de los posts"
			icon="arrow-clockwise"
		/>
		<AsyncButton
			url="/api/blog/slug/refresh"
			method="post"
			text="Regenerar slug de los posts"
			icon="arrow-clockwise"
		/>
		<AsyncButton
			url="/api/blog/slug/refresh"
			method="post"
			text="Regenerar slug de los posts"
			icon="arrow-clockwise"
		/>
	</GroupedActions>

	<AsyncButton
		url="/api/blog/slug/refresh"
		method="post"
		text="Regenerar slug de los posts"
		classes="w1 cta"
		icon="arrow-clockwise"
	/>

	<div class="w1 grid three-column-grid gap-small responsive">
		{#each data.posts as post}
			<div
				class="blog-post-card relative flex column gap-5"
				class:visible={post.visible}
				data-id={post.id}
			>
				<div class="image-container">
					<img src={post.image} alt={post.title} use:errorimage />
				</div>
				<small>{post.slug}</small>
				<h2>{post.title}</h2>
				<p class="down">{post.exceptr}</p>

				<div class="w1 flex end absolute top righ">
					<GroupedActions text="Acciones" position="right" item={true}>
						<ActionsLink icon="plus-circle" href={`/admin/blog/new`} color="info">
							Nuevo post
						</ActionsLink>

						<ActionsLink icon="pencil" href={`/admin/blog/update/${post.id}`} color="warn">
							Editar post
						</ActionsLink>

						<!-- <ActionButton
							action={'toggleVisibility'}
							method="post"
							text="{post.visible ? 'Ocultar' : 'Publicar'} post"
							icon={post.visible ? 'eye-slash' : 'eye'}
						/> -->
					</GroupedActions>
				</div>
			</div>
		{/each}
	</div>

	<ButtonCreate endpoint="/blog/new" />
</PageWrapper>

<style>
	.blog-post-card {
		padding: 1rem;
		border: 1px solid #ccc;
		background-color: #ffffff;
		border-radius: 5px;
		margin-bottom: 1rem;
	}

	.blog-post-card {
		background-color: aqua;
	}
	.blog-post-card.visible {
		background-color: #f9f9f9;
	}

	.blog-post-card .image-container {
		height: 200px;
		overflow: hidden;
	}

	.blog-post-card .image-container img {
		width: 100%;
		height: 100%;
		object-fit: fill;
	}
</style>
