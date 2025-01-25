export function errorimage(node: HTMLImageElement, fallbackImage: string = '/noimage.jpg') {
	if (!node.src) node.src = fallbackImage;
	node.draggable = false;
	node.dataset.fallback = fallbackImage;

	const handleError = () => {
		if (node.tagName === 'IMG') {
			node.src = fallbackImage;
		}
	};

	node.addEventListener('error', handleError);
	return {
		destroy() {
			node.removeEventListener('error', handleError);
		}
	};
}
