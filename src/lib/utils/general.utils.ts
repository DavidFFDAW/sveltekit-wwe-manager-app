export const Utils = {
    slugify: (text: string) => {
        return text
            .trim()
            .toLowerCase()
            .replace(/ /g, '-')
            .replace(/[^a-z0-9-]/g, '')
            .replace(/-+/g, '-')
            .replace(/[()$?&`'"=!¿¡]/gi, '');
    },
};
