export const Utils = {
	slugify: (text: string) => {
		return text
			.trim()
			.toLowerCase()
			.replace(/ /g, '-')
			.replace(/[ÀÁÂÃÄÅ]/g, 'a')
			.replace(/[àáâãäå]/g, 'a')
			.replace(/[ÈÉÊË]/g, 'e')
			.replace(/[èéêë]/g, 'e')
			.replace(/[ÌÍÎÏ]/g, 'i')
			.replace(/[ìíîï]/g, 'i')
			.replace(/[ÒÓÔÕÖ]/g, 'o')
			.replace(/[òóôõö]/g, 'o')
			.replace(/[ÙÚÛÜ]/g, 'u')
			.replace(/[ùúûü]/g, 'u')
			.replace(/[Ñ]/g, 'n')
			.replace(/[ñ]/g, 'n')
			.replace(/[Ç]/g, 'c')
			.replace(/[ç]/g, 'c')
			.replace(/[ÿ]/g, 'y')
			.replace(/[ý]/g, 'y')
			.replace(/[Æ]/g, 'ae')
			.replace(/[æ]/g, 'ae')
			.replace(/[Ø]/g, 'oe')
			.replace(/[ø]/g, 'oe')
			.replace(/[Å]/g, 'aa')
			.replace(/[å]/g, 'aa')
			.replace(/[Þ]/g, 'th')
			.replace(/[þ]/g, 'th')
			.replace(/[Ð]/g, 'd')
			.replace(/[^a-z0-9-]/g, '')
			.replace(/-+/g, '-')
			.replace(/[()$?&`'"=!¿¡]/gi, '');
	},
	readFile: (file: File): Promise<string> => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = (event: ProgressEvent<FileReader>) => {
				if (!event.target || typeof event.target.result !== 'string') {
					return reject(new Error('No se ha podido leer el archivo'));
				}
				resolve(event.target.result);
			};
			reader.onerror = reject;
			reader.readAsDataURL(file);
		});
	},
	getRandomID: (name: string): string => {
		if (!name) return Math.random().toString(36).substring(7);
		return `${name}-${Math.random().toString(36).substring(7)}`;
	}
};
