<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { onMount, tick, type Snippet } from 'svelte';

	interface Props {
		children: Snippet;
		label?: string;
		height?: number;
	}

	let { children, label = 'Accesos del panel' }: Props = $props();
	let actions: HTMLDivElement;

	afterNavigate(async () => {
		await tick();
		actions?.querySelector('[aria-current="page"]')?.scrollIntoView({
			block: 'nearest',
			inline: 'nearest'
		});
	});

	onMount(() => {
		document.body.classList.add('has-panel-fixed-navigation');
		return () => {
			document.body.classList.remove('has-panel-fixed-navigation');
		};
	});
</script>

<!-- Reserve the actual bar height, including when its children change size. -->
<nav class="panel-footer ww-footer-panel-nav" data-panel-footer aria-label={label}>
	<div class="footer-actions" bind:this={actions}>
		{@render children()}
	</div>
</nav>

<style>
	.panel-footer.ww-footer-panel-nav {
		position: fixed;
		inset: auto 0 0 var(--panel-footer-left, 0px);
		z-index: 40;
		padding: 5px 15px;
		padding-bottom: 5px;
		background: #fff;
		color: #252b36;
		border-top: 2px solid #dce0e6;
		border-radius: 20px 20px 0 0;
		height: 50px;
		box-shadow:
			0 -4px 20px #0000000d,
			0 -2px 10px #0000000d;
	}
	.footer-actions {
		display: flex;
		justify-content: safe flex-end;
		align-items: center;
		overflow-x: auto;
		gap: 10px;
		scrollbar-width: none;
		/* Local white covers hide each shadow when its scroll edge is reached. */
		background:
			linear-gradient(to right, #fff 30%, #fff0) left / 35px 100% local,
			linear-gradient(to left, #fff 30%, #fff0) right / 35px 100% local,
			linear-gradient(to right, #0002, #0000) left / 12px 100% scroll,
			linear-gradient(to left, #0002, #0000) right / 12px 100% scroll;
		background-repeat: no-repeat;
	}
	.panel-footer.ww-footer-panel-nav .footer-actions::-webkit-scrollbar {
		display: none;
	}

	.footer-actions > :global(*) {
		flex-shrink: 0;
	}
	.footer-actions :global(a),
	.footer-actions :global(button) {
		line-height: 1;
		min-height: 25px;
		white-space: nowrap;
	}
	.footer-actions > :global(a) {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		padding: 0.65rem 0.85rem;
		border-radius: 8px;
		font-size: 0.85rem;
		font-weight: 600;
		white-space: nowrap;
	}
	.footer-actions > :global(a:hover) {
		background: var(--surface2, #f0f3f7);
	}
	.footer-actions > :global(a[aria-current='page']) {
		background: #fce9ec;
		color: #a61120;
	}
	.footer-actions :global(:focus-visible) {
		outline: 2px solid var(--blue, #2563eb);
		outline-offset: -2px;
	}

	:global(body.has-async-form) .panel-footer.ww-footer-panel-nav {
		border-radius: 0;
	}

	@media screen and (max-width: 768px) {
		.footer-actions {
			justify-content: flex-start;
		}
	}
</style>
