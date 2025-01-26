export interface ImageData {
	src: string;
	width: number;
	height: number;
	image: HTMLImageElement;
}

export function readFile(file: File) {
	const fr = new FileReader();

	return new Promise<ImageData>((resolve, reject) => {
		fr.onload = () => {
			const image = new Image();
			image.src = fr.result as string;
			image.onload = () => {
				resolve({
					width: image.width,
					height: image.height,
					src: fr.result as string,
					image: image
				});
			};
		};
		fr.onerror = reject;
		fr.readAsDataURL(file);
	});
}

export default {
	readFile
};
