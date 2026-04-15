<script lang="ts">
	import { page } from '$app/state';
</script>

<h1>Error</h1>
<div class="error-page">
	<h2>Parece que algo salió mal</h2>

	{#if page.error}
		<div class="error-container">
			<small>{page.error.message}</small>
			<pre>{JSON.stringify(page.error, null, 4)}</pre>
		</div>
	{/if}

	<p>Puedes probar recargando la página o contactando al soporte.</p>

	<div class="button-links-container gap-smaller">
		<a href="/admin" class="btn icon" rel="noopener" aria-label="Dashboard">
			<i class="bi bi-speedometer2"></i>
			<span>Dashboard</span>
		</a>
		<a href="/" class="btn icon" rel="noopener" aria-label="Home">
			<i class="bi bi-house-door"></i>
			<span>Home</span>
		</a>
	</div>
</div>

<style>
	.error-page {
		width: 100%;
		padding: 2rem;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 1rem;
	}
	.error-page > * {
		width: 100%;
		flex: 1;
	}
	.error-page h2 {
		text-align: center;
	}
	.error-page .error-container {
		padding: 2rem;
		background-color: #f8d7da;
		color: #721c24;
		border: 1px solid #f5c6cb;
		border-radius: 4px;
	}
	.error-page .button-links-container {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
	}
	.error-page .button-links-container .btn {
		flex: 1;
		padding: 1rem;
		color: #fff;
		background-color: #45a27d;
		border: none;
		outline: none;
		border-radius: 5px;
		text-decoration: none;
	}
</style>
