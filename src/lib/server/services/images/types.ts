import type { Cookies } from "@sveltejs/kit";

export type ImageResponse = {
    name: string;
    url: string;
}
export type ImageUploadResponse = {
    error: boolean;
    message: string;
    data?: ImageResponse;
}
export type GalleryImage = {
    url: string,
    name: string,
    size: number,
    image_size: {
        "0": number,
        "1": number,
        "2": number,
        "3": string
        "bits": number,
        "mime": string
    },
    date: number,
    type: string,
    extension: string
}

export type ImageServiceDataProp = {
    cookies: Cookies;
    locals: App.Locals;
    searchParams: URLSearchParams;
}

export interface ImageServiceInterface {
    getImages: (data: ImageServiceDataProp, provider?: string) => Promise<ImageResponse[]>;
    uploadImage: (data: ImageServiceDataProp, file: File, provider?: string) => Promise<ImageUploadResponse>;
}