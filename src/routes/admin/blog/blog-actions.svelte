<script lang="ts">
	import ActionsButton from '$lib/components/buttons/grouped-actions/actions-button.svelte';
	import ActionsLink from '$lib/components/buttons/grouped-actions/actions-link.svelte';
	import GroupedActions from '$lib/components/buttons/grouped-actions/grouped-actions.svelte';
	import type { BlogPost } from '@prisma/client';
	export let post: BlogPost;
</script>

<GroupedActions text="Acciones" position="right" item={true} updateId={post.id}>
	<ActionsLink icon="plus-circle" href={`/admin/blog/new`} color="info">Nuevo post</ActionsLink>

	<ActionsLink icon="pencil" href={`/admin/blog/update/${post.id}`} color="warn">
		Editar post
	</ActionsLink>

	<ActionsButton
		action={'toggleVisibility'}
		method="post"
		icon={post.visible ? 'eye-slash' : 'eye'}
	>
		{post.visible ? 'Ocultar' : 'Publicar'} post
	</ActionsButton>
</GroupedActions>
