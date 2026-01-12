import type { GalleryImage, ImageServiceDataProp, ImageServiceInterface } from "../types";
import { IMAGE_API_URL } from "$env/static/private";
import { HttpService } from "$lib/services/http.service";

export const GalleryImageService: ImageServiceInterface = {
    getImages: async (data: ImageServiceDataProp) => {
        const response = await HttpService.get(`${IMAGE_API_URL}images`);
        if (!response.ok) return [];

        const images = response.response.data.images as GalleryImage[];
        return images.map(img => ({
            name: img.name,
            url: img.url
        }));
    },
    uploadImage: async (data: ImageServiceDataProp, file: File, provider: string = 'gallery') => {
        return { error: true, message: 'Servicio de imagen no implementado' };
    }
};