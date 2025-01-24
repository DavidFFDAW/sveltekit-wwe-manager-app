<script>
	import Box from '$lib/components/box/box.svelte';
	import AsyncForm from '$lib/components/forms/async-form.svelte';
	import BrandsSelector from '$lib/components/forms/inputs/brands-selector.svelte';
	import ImageInput from '$lib/components/forms/inputs/image-input.svelte';
	import Input from '$lib/components/forms/inputs/input.svelte';
	import PageWrapper from '$lib/components/page-wrapper/page-wrapper.svelte';
</script>

<PageWrapper page="wrestler-create">
	<AsyncForm redirect="/admin/wrestlers" method="post" buttonText="Crear luchador">
		<div class="grid two-column-grid responsive gap-medium">
			<Box title="Información" icon="info-circle">
				<Input
					maxLength={2}
					label="Nombre"
					name="name"
					type="text"
					placeholder="Nombre del luchador"
					required
				/>
				<Input label="Alias" name="alias" type="text" placeholder="Nombre del luchador" />
				<Input
					label="Finisher"
					name="finisher"
					type="text"
					required
					placeholder="Finisher del luchador"
				/>
				<Input label="Media" name="overall" type="number" placeholder="85" inputmode="numeric" />
			</Box>

			<input type="hidden" name="test[]" value="a" />
			<input type="hidden" name="test[]" value="b" />
			<input type="hidden" name="test[]" value="c" />

			<Box title="Datos de estados" icon="file-bar-graph">
				<div class="form-item">
					<label for="twitter_acc">Cuenta Twitter</label>
					<input type="text" id="twitter_acc" name="twitter_acc" required />
				</div>

				<div class="form-item">
					<label for="twitter_name">Nombre de Twitter</label>
					<input type="text" id="twitter_name" name="twitter_name" required />
				</div>

				<BrandsSelector required />
			</Box>

			<Box title="Imágenes" icon="image">
				<ImageInput label="Imagen de luchador" name="image" />
				<ImageInput label="Imagen de twitter" name="twitter-image" />
			</Box>
		</div>
	</AsyncForm>
</PageWrapper>
