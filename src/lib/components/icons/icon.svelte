<script>
	import { fly } from 'svelte/transition';

	export let icon = '';
	export let classes = '';
</script>

<i transition:fly class="bi bi-{icon} {classes} customs-icons app-bootstrap-custom-icon"></i>
