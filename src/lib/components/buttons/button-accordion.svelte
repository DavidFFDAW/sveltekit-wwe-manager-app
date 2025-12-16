<script lang="ts">
	import { fade } from 'svelte/transition';

	let { title, class: className, children, ...restProps } = $props();
	let openedState = $state(false);

	const toggleState = () => (openedState = !openedState);
</script>

<div class="btn-group btn-accordion" class:accordion-opened={openedState}>
	<button
		class="btn btn-accordion-toggle {className}"
		type="button"
		{...restProps}
		aria-expanded={openedState}
		aria-label={title}
		onclick={toggleState}
	>
		<span>{title}</span>
		<i class="bi bi-arrow-down-circle btn-accordion-icon"></i>
	</button>

	{#if openedState}
		<div class="btn-accordion-content" transition:fade>
			{@render children()}
		</div>
	{/if}
</div>

<style>
	.btn-accordion {
		position: relative;
	}
	.btn-accordion .btn-accordion-toggle {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.btn-accordion .btn-accordion-toggle i.btn-accordion-icon {
		font-size: 1.2em;
		display: block;
	}
	.btn-accordion .btn-accordion-toggle i.btn-accordion-icon {
		transform: rotate(-180deg);
	}
	.btn-accordion.accordion-opened .btn-accordion-toggle i.btn-accordion-icon {
		transform: rotate(0deg);
	}

	.btn-accordion .btn-accordion-content {
		display: none;
	}
	.btn-accordion.accordion-opened .btn-accordion-content {
		display: block;
	}
	.accordion-opened .btn-accordion-content {
		position: absolute;
		width: 100%;
		left: 0;
		bottom: 100%;
		display: flex;
		flex-wrap: wrap;
		gap: 4px;
		background-color: #fff;
		border: 1px solid #ddd;
		border-radius: 5px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		z-index: 10;
		max-height: 500px; /* Arbitrary large value to allow content expansion */
		padding: 8px 5px;
	}
</style>
