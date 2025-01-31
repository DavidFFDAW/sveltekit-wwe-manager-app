<script lang="ts">
	import { errorimage } from '$lib/actions/error.image';
	import Icon from '$lib/components/icons/icon.svelte';
	import { HttpService } from '$lib/services/http.service';
	import { Utils } from '$lib/utils/general.utils';
	import { Toast } from '$lib/utils/toast.helper';
	import type { ImgurImage } from '../../../../@types/Imgur';

	let image: string = '';
	let input: HTMLInputElement;
	export let images: ImgurImage[] = [];

	async function dropImage(event: DragEvent) {
		if (!event.dataTransfer) return;
		const file = event.dataTransfer.files[0];

		// if (file.type.match('*.webp')) return Toast.error('La extensión webp no está soportada');
		image = await Utils.readFile(file);
	}

	async function changeImage(event: Event) {
		const target = event.target;
		if (!(target instanceof HTMLInputElement)) return;
		if (!target.files) return;

		const file = target.files[0];
		image = await Utils.readFile(file);
	}

	async function uploadImage() {
		if (!image) return Toast.error('No hay imagen para subir');

		if (!input.files) return;
		const file = input.files[0];
		const formData = new FormData();
		formData.append('imgur-image', file);

		const response = await HttpService.post('/api/imgur/upload', {
			body: formData
		});

		if (!response.ok)
			return Toast.error(response.response.message || 'Error al subir la imagen a imgur');
		const data = response.response.uploaded_image as ImgurImage;

		images = [...images, data];
		return Toast.success('Imagen subida correctamente');
	}
</script>

<div class="w1 flex column center acenter h1">
	<div class="w1 container flex astart gap-small responsive">
		<div class="image-wrapper relative responsive-w1">
			<img
				src={image || '/noimage.jpg'}
				class="w1"
				alt="preview of uploading blog cover"
				role="presentation"
				on:click={() => input.click()}
				use:errorimage
			/>
			<input
				type="file"
				class="app-file"
				accept="image/*"
				bind:this={input}
				on:dragover|preventDefault
				on:drop|preventDefault={dropImage}
				on:change={changeImage}
			/>
		</div>

		<div class="w1 text-block flex between column responsive">
			<div class="ondesktop">
				<h4>Subir imágenes a imgur</h4>
				<p>
					Imgur es una de las plataformas más populares para compartir imágenes en línea, utilizada
					tanto por usuarios individuales como por comunidades enteras. Al subir imágenes a Imgur,
					es importante conocer las especificaciones y requisitos para garantizar que tus imágenes
					se carguen correctamente y se muestren de la mejor manera posible. A continuación, se
					detallan las especificaciones más relevantes para subir imágenes a Imgur.
				</p>
				<p>
					Imgur permite varios formatos de archivo para la carga de imágenes. Los formatos más
					comunes incluyen:
				</p>

				<ul>
					<li>
						<strong>JPEG/JPG</strong>: Este es uno de los formatos más utilizados para fotografías y
						imágenes con muchos colores. Es ideal para imágenes con degradados suaves.
					</li>
					<li>
						<strong>PNG</strong>: Este formato es excelente para imágenes que requieren
						transparencia o que tienen texto y gráficos nítidos. Es comúnmente utilizado para
						logotipos y gráficos.
					</li>
					<li>
						GIF: Imgur permite la carga de archivos GIF animados, lo que es perfecto para compartir
						animaciones cortas.
					</li>
					<li>
						<strong>BMP</strong>: Aunque menos común, Imgur también acepta archivos BMP, que son
						imágenes de mapa de bits.
					</li>
					<li>
						<strong>TIFF</strong>: Este formato es menos utilizado en la web, pero Imgur permite su
						carga, especialmente para imágenes de alta calidad.
					</li>
				</ul>
			</div>

			<button type="button" class="w1 btn cta icon" on:click={uploadImage}>
				<Icon icon="upload" />
				Subir imagen
			</button>
		</div>
	</div>
</div>

<style>
	.container {
		width: 100%;
		height: 100%;
	}

	.container img {
		width: 100%;
		height: 100%;
		max-height: 600px;
		object-fit: cover;
	}

	.container .text-block p {
		margin: 5px 0;
	}

	.container .text-block ul {
		margin: 15px 0;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 10px;
	}

	.container .text-block ul li {
		padding-left: 25px;
	}
</style>
