import type { ImageServiceDataProp, ImageServiceInterface } from "./types";
import { GalleryImageService } from "./subservices/gallery.service";
import { GoogleImageService } from "./subservices/google.service";

export const ImageService: ImageServiceInterface = {
    getImages: async (data: ImageServiceDataProp, provider: string = 'gallery') => {
        if (provider === 'gallery') return await GalleryImageService.getImages(data);
        if (provider === 'google') return await GoogleImageService.getImages(data);
        return [];
    },
    uploadImage: async (data: ImageServiceDataProp, file: File, provider: string = 'gallery') => {
        return { error: true, message: 'Servicio de imagen no implementado' };
    }
};