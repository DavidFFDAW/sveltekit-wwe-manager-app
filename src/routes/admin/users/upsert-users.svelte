<script lang="ts">
	import Box from '$lib/components/box/box.svelte';
	import ImageInput from '$lib/components/forms/inputs/image-input.svelte';
	import Input from '$lib/components/forms/inputs/input.svelte';
	import RadioList from '$lib/components/forms/inputs/radio-list.svelte';
	import ToggleInput from '$lib/components/forms/inputs/toggle-input.svelte';
	import type { User } from '@prisma/client';

	export let user: User;
</script>

<div class="w1 grid two-column-grid gap-medium responsive">
	<Box icon="person" title="Datos basicos">
		<ImageInput name="image" label="Imagen" image={user.image as string} />
		<Input type="text" name="name" label="Nombre" value={user.name} />
		<Input type="email" name="email" label="Correo" value={user.email} />
		<Input type="text" name="username" label="Nombre usuario" value={user.username} />
		<RadioList
			name="role"
			label="Rol"
			options={[
				{
					label: 'Cliente',
					value: 'user'
				},
				{
					label: 'Admin',
					value: 'admin'
				}
			]}
			bind:value={user.type}
		/>
	</Box>

	<Box title="Clave" icon="key">
		<div class="w1 flex column gap-smaller">
			<div class="w1 flex column gap-smaller">
				<Input type="password" name="password" label="Clave" />
				<Input type="password" name="password_confirmation" label="Confirmar clave" />
			</div>
			<p class="w1">
				<strong>Advertencia:</strong>
				Al introducir un nuevo valor, modificará la contraseña/clave actual. Si no desea modificar la
				clave, deje los campos en blanco.
			</p>
		</div>
	</Box>

	<Box title="Marketing" icon="marketing">
		<div class="w1 flex gap-smaller">
			<ToggleInput
				label="Recibir notificaciones"
				name="user_marketing_notifications"
				checked={user.newsletter_subscription}
			/>
		</div>
	</Box>
</div>
