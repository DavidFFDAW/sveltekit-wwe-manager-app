<script>
	import { errorimage } from '$lib/actions/error.image';
	import MainHeader from '$lib/components/headers/main-header.svelte';
	import PageWrapper from '$lib/components/page-wrapper/page-wrapper.svelte';
	import SubscriptionBlock from './subscription-block.svelte';
	import { Utils } from '$lib/utils/general.utils';

	export let data;
	let isAdmin = data.userIsAdmin;
</script>

<MainHeader
	title="Blog"
	height="450px"
	bgPosition="top"
	mobileBgPosition="center"
	background="https://www.wrestlinginc.com/img/gallery/cody-rhodes-says-the-final-boss-reminds-him-of-wwe-hall-of-famers-heel-turn/l-intro-1712436460.jpg"
	mobileBackground="https://e00-xlk-ue-marca.uecdn.es/uploads/2024/03/28/66056608b302d.jpeg"
	titlePosition="center"
/>

<PageWrapper page="blog">
	<SubscriptionBlock user={data.user} />
	<section class="blog-content flex column gap latest-news">
		<h2 class="w1 tleft">Ultimas noticias</h2>
		<div class="w1 flex center astart gap-medium blog-list responsive">
			{#each data.posts.slice(0, 3) as post}
				<article class="w1 blog-article">
					<a href="/blog/{post.slug}">
						<div class="w1 h1 article-content">
							<header>
								{#if data.userIsAdmin}
									<span class="badge badge-post-status">
										{post.status}
									</span>
								{/if}
								<img src={post.image} alt={post.title} use:errorimage />
							</header>
							<div class="w1 h1 text-content flex column gap-medium astart">
								<h3>{post.title}</h3>
								<p>{post.exceptr}{post.exceptr?.endsWith('.') ? '' : '.'}</p>

								<footer class="w1 flex end blog-article-footer">
									<p class="date-text">{Utils.formatDate(post.created_at)}</p>
									{#if post.category}
										<span class="badge badge-category">{post.category}</span>
									{/if}
								</footer>
							</div>
						</div>
					</a>
				</article>
			{/each}
		</div>
	</section>

	<section class="blog-content rest-of-news flex column gap astart down">
		<h2>Otras noticias</h2>
		<div class="w1 ww-posts ww-posts-container blog-list">
			{#each data.posts.slice(3) as post}
				<article class="w1 blog-article">
					<a href="/blog/{post.slug}" class="w1 block">
						<div class="w1 article-content">
							<header>
								{#if data.userIsAdmin}
									<span class="badge badge-post-status">
										{post.status}
									</span>
								{/if}
								<img src={post.image} alt={post.title} use:errorimage />
							</header>
							<div class="w1 text-content flex column gap-medium astart">
								<h3>{post.title}</h3>
								<p>{post.exceptr}{post.exceptr?.endsWith('.') ? '' : '.'}</p>

								<footer class="w1 flex end blog-article-footer">
									<p class="date-text">{Utils.formatDate(post.created_at)}</p>
									{#if post.category}
										<span class="badge badge-category">{post.category}</span>
									{/if}
								</footer>
							</div>
						</div>
					</a>
				</article>
			{/each}
		</div>
	</section>
</PageWrapper>

<style>
	.article-content {
		position: relative;
		height: 100%;
	}
	.blog-content.latest-news {
		position: relative;
		padding: 15px;
		padding-bottom: 50px;
		background-color: #333;
		z-index: 2;
	}
	.blog-content.latest-news .blog-list {
		margin: 0 auto;
		max-width: 1400px;
	}
	.blog-content.latest-news .blog-list article {
		border: 1px solid #555;
		border-radius: 8px;
		overflow: hidden;
	}

	.blog-content.latest-news::after {
		content: '';
		position: absolute;
		top: 0;
		left: -15px;
		width: calc(100% + 30px);
		height: 100%;
		background-color: #333;
		z-index: -1;
	}
	.blog-content.latest-news .blog-list {
		align-items: unset;
	}

	.blog-content.latest-news {
		color: #fff;
	}
	.blog-content h2 {
		font-size: 2rem;
		font-weight: 700;
		font-family: 'dreadnotus', sans-serif;
		text-transform: uppercase;
	}
	.blog-content.rest-of-news {
		margin: 0 auto;
		max-width: 1400px;
	}

	article {
		border-radius: 5px;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
		overflow: hidden;
	}

	article a {
		display: block;
		height: 100%;
	}
	article .text-content {
		padding: 1rem;
		background-color: #fff;
		color: #333;
	}

	article img {
		width: 100%;
		height: 250px;
		max-height: 250px;
		object-fit: cover;
	}

	.blog-content.rest-of-news article img {
		height: 280px;
		max-height: 100%;
	}

	.ww-posts.ww-posts-container.blog-list {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
		gap: 20px;
	}
	.ww-posts.ww-posts-container.blog-list article {
		border: 1px solid #ccc;
		border-radius: 8px;
		overflow: hidden;
	}

	/* footer.blog-article-footer {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: flex-start;
		margin-top: 1rem;
	} */
	footer.blog-article-footer .date-text {
		position: absolute;
		bottom: 10px;
		right: 10px;
		font-size: 0.85rem;
		padding: 4px 12px;
		background: #fff;
		color: #000;
		border: 1px solid #ccc;
		border-radius: 25px;
	}
	footer.blog-article-footer span {
		align-self: flex-end;
		display: inline-block;
		background-color: #333;
		color: #fff;
		padding: 3px 8px;
		font-size: 0.75rem;
		text-transform: uppercase;
		margin-top: 5px;
	}
	.badge.badge-post-status {
		position: absolute;
		top: 10px;
		right: 10px;
		padding: 5px 12px;
		font-size: 0.75rem;
		text-transform: capitalize;
		text-align: center;
		background-color: rgba(0, 0, 0, 0.7);
		color: #fff;
	}

	article h3 {
		text-align: start;
		text-transform: uppercase;
		font-size: 1.25rem;
		font-weight: 600;
		color: #333;
	}
	article .text-content {
		gap: 0.5rem;
	}
	article .text-content > p {
		color: #555;
		font-size: 0.95rem;
		padding-bottom: 22px;
	}

	article h3,
	article p,
	article span {
		line-height: 1.2;
	}

	article:hover {
		box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
		transform: translateY(-6px);
		transition: all 0.2s ease-in-out;
	}
	article:hover .text-content,
	article:hover .article-content {
		background-color: #f9f9f9;
	}
</style>
