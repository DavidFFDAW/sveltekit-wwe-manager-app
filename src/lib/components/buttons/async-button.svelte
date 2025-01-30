<script lang="ts">
	import HttpForm from '../forms/http-form.svelte';
	import Icon from '../icons/icon.svelte';

	export let url: string;
	export let text: string;
	export let icon: string = '';
	export let redirect: string = '';
	export let classes: string = 'async-button';
	export let method: 'get' | 'post' | 'put' | 'delete' = 'post';
</script>

<HttpForm action={url} {method} {redirect}>
	<button type="submit" class="btn {classes}" data-url={url} data-method={method}>
		<div class="w1 flex center gap-smaller">
			{#if icon}
				<Icon {icon} />
			{/if}
			<span>{text}</span>
		</div>

		<slot />
	</button>
</HttpForm>
