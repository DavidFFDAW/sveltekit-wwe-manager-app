<script lang="ts">
	let { data } = $props();
</script>

<div class="page-container">
	<header class="page-header">
		<h1>Categorias de post</h1>
		<small>Aquí puedes gestionar las categorias de los posts del blog</small>
	</header>

	<div class="w1 box post-categories-container">
		<header class="title-block flex start acenter gap-smaller pointer">
			<i class="bi bi-card-text text-2xl"></i>
			<h2 class="box-title">Categorias</h2>
		</header>

		<div class="box-content">
			{#each data.categories as category}
				<div class="w1 post-category-item flex between acenter gap-smaller">
					<span>{category}</span>
					<div class="actions">
						<button class="btn small rounded icon danger" title="Eliminar categoria">
							<i class="bi bi-trash"></i>
						</button>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>
