<script lang="ts">
	import { errorimage } from '$lib/actions/error.image';
	import { Utils } from '$lib/utils/general.utils';

	let { post, isAdmin } = $props();
	let excerpt = post.exceptr.trim();
	const ends = ['.', '!', '?'];
</script>

<article class="blog-post-article blog-post-container">
	<a href="/blog/{post.slug}" class="blog-post-link">
		<img
			src={post.image}
			alt={post.title}
			class="blog-post-image"
			use:errorimage={'/noimage.jpg'}
		/>
		<div class="blog-post-content">
			<h3 class="post-title">{post.title}</h3>
			<p class="post-excerpt">
				{excerpt}{!ends.includes(excerpt.slice(-1)) ? '.' : ''}
			</p>
		</div>

		{#if isAdmin}
			<span class="badge badge-post-status capitalize">{post.status}</span>
		{/if}

		<p class="badge badge-date-text">{Utils.formatDate(post.created_at)}</p>
	</a>

	{#if isAdmin}
		<a href="/admin/blog/upsert?id={post.id}" class="blog-post-admin-link badge icon">
			<i class="bi bi-gear-fill"></i>
			<span>Editar</span>
		</a>
	{/if}
</article>

<style>
	.blog-post-article,
	.blog-post-link {
		display: block;
		height: 100%;
		position: relative;
	}
	.blog-post-article {
		display: flex;
		flex-direction: column;
		height: 100%;

		color: #333;
		border-radius: 8px;
		background-color: #fff;
		border: 1px solid #ccc;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
		overflow: hidden;
	}

	.blog-post-article .blog-post-link .blog-post-image {
		width: 100%;
		height: 250px;
		max-height: 250px;
		object-fit: cover;
		object-position: top;
	}

	.blog-post-article .blog-post-link .blog-post-content {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;

		padding: 15px 15px 40px 15px;
		overflow: hidden;
	}

	.blog-post-article .blog-post-link .blog-post-content h3 {
		font-size: 1.1rem;
		text-transform: uppercase;
		transform: scaleY(1.2);
	}
	.blog-post-article .blog-post-link .blog-post-content p.post-excerpt {
		flex: 1;
		font-size: 0.9rem;
		color: #333;
		line-height: 1.1;
		opacity: 0.9;
	}

	.blog-post-article .badge {
		position: absolute;
		top: 10px;
		left: 10px;
		text-align: center;
		padding: 3px 12px;
		font-size: 0.75rem;
		background-color: rgba(0, 0, 0, 0.7);
		border: 1px solid #000;
		color: #fff;
	}
	.blog-post-article .badge.badge-date-text {
		top: auto;
		left: auto;
		bottom: 10px;
		right: 10px;
		font-size: 0.75rem;
		padding: 4px 12px;
		background: #fff;
		color: #565656;
		border: 1px solid #ccc;
		font-weight: 500;
	}

	.blog-post-article:hover {
		transform: translateY(-5px);
		transition-duration: 0.2s;
	}

	.blog-post-article > a.blog-post-admin-link {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 4px;

		position: absolute;
		top: 10px;
		right: 10px;
		left: auto;
		/* use warn colors */
		background-color: rgba(255, 235, 208, 0.7);
		color: #000;
		padding: 3px 12px;
		font-size: 0.75rem;
		border: 1px solid #000;
		z-index: 1000;
	}
</style>
