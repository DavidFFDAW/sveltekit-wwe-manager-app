export const scrollToElement = (selector: string): void => {
	const element = document.querySelector(selector);
	if (!element) return;

	element.scrollIntoView({ behavior: 'smooth', block: 'center' });
};

export const scrollToTop = (): void => {
	window.scrollTo({ top: 0, behavior: 'smooth' });
};

export const scrollToBottom = (): void => {
	window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
};
