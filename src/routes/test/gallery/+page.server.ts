import { ImageService } from "$lib/server/services/images/image.service.js";

export async function load(request) {
    const datas = {
        cookies: request.cookies,
        locals: request.locals,
        searchParams: request.url.searchParams
    };
    const images = await ImageService.getImages(datas, 'google');
    console.log('Gallery images loaded:', images);
    return {
        images
    };
}