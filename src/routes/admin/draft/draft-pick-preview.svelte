<script lang="ts">
	import type { Wrestler } from '@prisma/client';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	let timeout: NodeJS.Timeout | null = null;
	export let showPreview: boolean;
	export let smackdown: Wrestler;
	export let raw: Wrestler;
	const audio = new Audio('/sounds/draft-sound.mp3');
	audio.volume = 1;
	audio.muted = false;
	audio.preload = 'metadata';
	audio.playbackRate = 1.1;
	audio.currentTime = 0.1;

	onMount(() => {
		if (timeout) clearTimeout(timeout);
		audio.play().catch((error) => {
			console.error('Error playing audio:', error);
		});
		timeout = setTimeout(() => {
			showPreview = false;
		}, 2000);

		return () => {
			if (timeout) clearTimeout(timeout);
		};
	});
</script>

<div class="draft-pick-container" transition:fade={{ duration: 500 }}>
	<div class="draft-pick-preview">
		<div class="draft-pick-raw">
			<h3>Raw</h3>
			<p>{raw.name}</p>
			<img width="400" height="400" src={raw.image_name as string} alt={raw.name} />
		</div>
		<div class="draft-pick-smackdown">
			<h3>Smackdown</h3>
			<p>{smackdown.name}</p>
			<img width="400" height="400" src={smackdown.image_name as string} alt={smackdown.name} />
		</div>
	</div>
</div>

<style>
	.draft-pick-container {
		width: 100%;
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		flex-direction: column;
		z-index: 99999999999999999;
	}
	.draft-pick-preview {
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100%;
	}

	.draft-pick-preview .draft-pick-raw {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background: linear-gradient(0deg, rgba(0, 0, 0, 0.6) 40%, var(--raw));
		color: white;
		padding: 20px;
	}

	.draft-pick-preview .draft-pick-smackdown {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background: linear-gradient(45deg, rgba(0, 0, 0, 0.6) 40%, var(--smackdown));
		color: white;
		padding: 20px;
	}
</style>
