<script>
	import AsyncForm from '$lib/components/forms/async-form.svelte';
	import ImageInput from '$lib/components/forms/inputs/image-input.svelte';
	import Input from '$lib/components/forms/inputs/input.svelte';
	import PageWrapper from '$lib/components/page-wrapper/page-wrapper.svelte';
</script>

<PageWrapper page="admin-push">
	<h1>Send Push Notification</h1>
	<AsyncForm action="" method="post" showButtons={false}>
		<div class="box flex column gap-medium">
			<Input type="text" label="Title" name="title" required />
			<Input type="text" label="Body" name="body" required />
			<Input type="url" label="URL" name="url" required />
			<ImageInput label="Image" name="image" required />

			<div class="w1 flex end">
				<button type="submit" class="btn cta">Enviar notificación</button>
			</div>
		</div>
	</AsyncForm>
</PageWrapper>
