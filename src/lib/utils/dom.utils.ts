export const scrollToElement = (selector: string, timeout: number = 250): void => {
    const element = document.querySelector(selector);
    console.log(element);

    if (!element) return;

    setTimeout(() => {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, timeout);
};

export const scrollToTop = (): void => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

export const scrollToBottom = (): void => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
};
