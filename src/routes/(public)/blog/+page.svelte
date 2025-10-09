<script>
	import { errorimage } from '$lib/actions/error.image';
	import MainHeader from '$lib/components/headers/main-header.svelte';
	import PageWrapper from '$lib/components/page-wrapper/page-wrapper.svelte';
	import SubscriptionBlock from './subscription-block.svelte';

	export let data;
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
								<img src={post.image} alt={post.title} use:errorimage />
							</header>
							<div class="w1 h1 text-content flex column gap-medium astart">
								<h3>{post.title}</h3>
								<p>{post.exceptr}</p>

								<footer class="w1 flex end">
									<p>{post.created_at?.toLocaleDateString()}</p>
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
		<div class="w1 grid three-column-grid responsive gap-medium blog-list">
			{#each data.posts.slice(3) as post}
				<article class="w1 blog-article">
					<a href="/blog/{post.slug}" class="w1 block">
						<div class="w1 article-content">
							<header>
								<img src={post.image} alt={post.title} use:errorimage />
							</header>
							<div class="w1 text-content flex column gap-medium astart">
								<h3>{post.title}</h3>
								<p>{post.exceptr}</p>

								<footer class="w1 flex end">
									<p>{post.created_at?.toLocaleDateString()}</p>
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
	.blog-content.latest-news {
		position: relative;
		padding: 15px;
		padding-bottom: 50px;
		background-color: #333;
		z-index: 2;
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
		/* max-height: 200px; */
	}

	.blog-content.rest-of-news .blog-list {
		gap: 25px;
	}
	.blog-content.rest-of-news article img {
		height: 280px;
		max-height: 100%;
	}
</style>
