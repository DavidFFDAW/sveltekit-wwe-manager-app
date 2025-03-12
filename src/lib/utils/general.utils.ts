export const Utils = {
	slugify: (text: string) => {
		const temporalText = text
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

		// get rid of the initial `the` from the slug
		return temporalText.startsWith('the-') ? temporalText.replace('the-', '') : temporalText;
	},
	readFile: (file: File, type = 'url'): Promise<string> => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = (event: ProgressEvent<FileReader>) => {
				if (!event.target || typeof event.target.result !== 'string') {
					return reject(new Error('No se ha podido leer el archivo'));
				}
				resolve(event.target.result);
			};
			reader.onerror = reject;
			if (type === 'url') reader.readAsDataURL(file);
			if (type === 'text') reader.readAsText(file);
			if (type === 'buffer') reader.readAsArrayBuffer(file);
		});
	},
	getRandomID: (name: string): string => {
		if (!name) return Math.random().toString(36).substring(7);
		return `${name}-${Math.random().toString(36).substring(7)}`;
	},
	urlBase64ToUint8Array: (base64String: string) => {
		const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
		const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
		const rawData = atob(base64);
		return new Uint8Array([...rawData].map((char) => char.charCodeAt(0)));
	},
	formatDate: (date: Date | null, includeHours = false): string => {
		if (!date) return '';
		const options: Intl.DateTimeFormatOptions = {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		};
		if (includeHours) {
			options.hour = 'numeric';
			options.minute = 'numeric';
			options.second = 'numeric';
		}

		return date.toLocaleDateString('es-ES', options);
	}
};
