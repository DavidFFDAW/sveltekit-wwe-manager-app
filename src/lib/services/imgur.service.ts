import { Toast } from '$lib/utils/toast.helper';
import type { ImgurImage } from '../../@types/Imgur';
import { HttpService } from './http.service';

export const getImgurImages = async (): Promise<ImgurImage[]> => {
    const response = await HttpService.get('/api/imgur/images');
    if (!response.ok) return [];
    return response.response.images as ImgurImage[];
};

export const deleteImageByHash = async (hash: string): Promise<boolean> => {
    const confirmation = confirm('¿Estás seguro de eliminar la imagen?');
    if (!confirmation) return false;

    const response = await HttpService.delete(`/api/imgur/delete/${hash}`);
    if (!response.ok) return false;

    return true;
};

export async function uploadImgurImage(image: File) {
    if (!image) return Toast.error('No hay imagen para subir');

    const formData = new FormData();
    formData.append('imgur-image', image);

    const response = await HttpService.post('/api/imgur/upload', {
        body: formData,
    });

    if (!response.ok) return Toast.error(response.response.message || 'Error al subir la imagen a imgur');
    const data = response.response.uploaded_image as ImgurImage;
    return data;
}

export const ImgurService = {
    getImgurImages,
    deleteImageByHash,
    uploadImgurImage,
};

export default ImgurService;
