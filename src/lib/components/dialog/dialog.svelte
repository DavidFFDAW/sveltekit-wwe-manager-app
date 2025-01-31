<script lang="ts">
	import Icon from '../icons/icon.svelte';

	let dialog: HTMLDialogElement;
	export let opened: boolean;

	const closeDialog = () => {
		dialog.close();
		opened = false;
	};

	$: {
		if (opened) dialog.showModal();
		if (!opened && dialog) dialog.close();
	}
</script>

<dialog class="app-general-dialog" bind:this={dialog}>
	<header class="app-general-dialog-header" class:has-header={$$slots.header}>
		<slot name="header"></slot>
		<button on:click={closeDialog} type="button" class="app-general-dialog-close">
			<Icon icon="x" />
		</button>
	</header>

	<div class="app-general-dialog-content">
		<slot></slot>
	</div>
</dialog>

<style>
	.app-general-dialog {
		position: fixed;
		top: 50%;
		left: 50%;
		width: 90%;
		height: 90%;
		outline: none;
		background-color: #fff;
		z-index: 9998;
		transform: translate(-50%, -50%);
		border-radius: 10px;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
		border: 0;
	}

	.app-general-dialog::backdrop {
		background-color: rgba(0, 0, 0, 0.6);
	}

	.app-general-dialog header.app-general-dialog-header {
		position: sticky;
		top: 0;
		left: 0;
		display: flex;
		justify-content: flex-end;
		width: 100%;
		background-color: #f1f1f1;
	}

	.app-general-dialog header.app-general-dialog-header.has-header {
		justify-content: space-between;
	}

	.app-general-dialog header.app-general-dialog-header button.app-general-dialog-close {
		color: #fff;
		border-radius: 0;
		padding: 10px;
		background-color: #c91727;
	}

	.app-general-dialog .app-general-dialog-content {
		padding: 1rem;
	}

	dialog.app-general-dialog[open] {
		animation: fadeIn 0.3s;
	}

	@keyframes fadeIn {
		from {
			transform: translate(-50%, -50%) scale(0.5);
			opacity: 0;
		}
		to {
			transform: translate(-50%, -50%) scale(1);
			opacity: 1;
		}
	}
</style>
