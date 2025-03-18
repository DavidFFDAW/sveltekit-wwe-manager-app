<script lang="ts">
	import { fly } from 'svelte/transition';
	import Icon from '../../icons/icon.svelte';
	import { onMount } from 'svelte';
	import SimpleAsyncForm from '$lib/components/forms/simple-async-form.svelte';

	export let open: boolean = false;
	export let item: boolean = false;
	export let text: string = 'Acciones agrupadas';
	export let position: 'left' | 'right' = 'left';
	export let updateId: string | number = 0;

	function clickOutside(event: MouseEvent) {
		if (!(event.target as HTMLElement).closest('.grouped-actions-wrapper-container')) open = false;
	}

	onMount(() => {
		document.body.addEventListener('click', clickOutside);

		return () => {
			document.body.removeEventListener('click', clickOutside);
		};
	});
</script>

<div
	class="grouped-actions-wrapper-container {position} {item ? 'is-item' : 'normal-action'}"
	class:open
>
	<SimpleAsyncForm bind:updateId afterSubmit={() => (open = false)}>
		<button
			class="grouped-actions-button btn cta icon"
			on:click|preventDefault={() => (open = !open)}
		>
			<div class="icon-container-rotation">
				<Icon icon={open ? 'x' : 'list'} />
			</div>
			<span>{text}</span>
		</button>

		{#if open}
			<div class="grouped-actions-container {position}" transition:fly>
				<slot></slot>
			</div>
		{/if}
	</SimpleAsyncForm>
</div>

<style>
	.grouped-actions-wrapper-container {
		position: relative;
	}
	.grouped-actions-wrapper-container.open .icon-container-rotation {
		transform: rotate(90deg);
	}
	.grouped-actions-wrapper-container.is-item .grouped-actions-button span {
		display: none;
	}

	.grouped-actions-button {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.grouped-actions-wrapper-container.open button.cta {
		border-radius: 5px 5px 0 0;
	}

	.grouped-actions-wrapper-container.is-item .grouped-actions-button {
		justify-content: center;
		border-radius: 0 0 0 50px;
		padding: 6px 12px;
		margin-left: 10px;
		background-color: #fff;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
		border: none;
		color: #333;
	}

	.grouped-actions-container {
		display: flex;
		flex-direction: column;
		position: absolute;
		top: 100%;
		width: auto;
		background-color: #fff;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
		border-radius: 0 5px 5px 5px;
		border: 1px solid rgba(0, 0, 0, 0.2);
		border-top: none;
		overflow: hidden;
		z-index: 2;
	}
	.grouped-actions-container.left {
		width: calc(100% + 150px);
	}

	.grouped-actions-wrapper-container.left .grouped-actions-container {
		left: 0;
	}

	.grouped-actions-wrapper-container.right .grouped-actions-container {
		right: 0;
		border-radius: 5px 0 5px 5px;
	}
</style>
