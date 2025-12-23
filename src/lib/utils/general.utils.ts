import { brands } from './../constants/app';

interface CSVDatas {
	header: string[];
	datas: Record<string, string>[];
}

export function createCsv(data: Record<string, unknown>[], givenExceptions: string[] = []) {
	const exceptions = [...givenExceptions, , 'created_at', 'updated_at'];
	const header = Object.keys(data[0])
		.filter((key) => {
			return !exceptions.includes(key);
		})
		.join(',');

	const rows = data
		.map((item) => {
			return Object.entries(item)
				.filter(([key, _]) => {
					return !exceptions.includes(key);
				})
				.map(([_, value]) => value?.toString().replace(/,/g, ' ').replace(/\n/g, ' '));
		})
		.join('\n');

	return `${header}\n${rows}`;
}

export function readCsvContent(csv: string): CSVDatas {
	const lines = csv
		.split('\n')
		.map((line) => line.trim())
		.filter((line) => line);
	const header = lines[0].split(',').map((col) => col.trim());

	return {
		header: header,
		datas: lines.slice(1).map((line) => {
			const values = line.split(',').map((value) => value.trim());
			return header.reduce(
				(obj, key, index) => {
					obj[key] = values[index] || '';
					return obj;
				},
				{} as Record<string, string>
			);
		})
	};
}

export function getArrayFormDatas(formData: FormData, keys: string[]): Record<string, string>[] {
	const firstData = formData.getAll(keys[0]);
	if (!firstData || firstData.length === 0) return [];

	const allDatas = keys.map((key) => formData.getAll(key) as unknown[]);

	return firstData.map((_, index) => {
		return keys.reduce(
			(obj, key, keyIndex) => {
				const _key = key.replace(/\[\]$/, '');
				obj[_key] = allDatas[keyIndex][index] as string;
				return obj;
			},
			{} as Record<string, string>
		);
	});
}

export const getParsedFormDatas = (formData: FormData) => {
	const keys = formData.keys();

	return keys
		.map((key) => {
			return {
				key: key.trim().replace(/\[\]$/, '').replace(/\s+/g, '_').toLowerCase(),
				values: formData.getAll(key)
			};
		})
		.map((o) => {
			return {
				[o.key]: o.values.length > 1 ? o.values : o.values[0]
			};
		})
		.reduce((a, b) => ({ ...a, ...b }), {});
};

export const getRandomNumberBetween = (min: number, max: number): number => {
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

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
	deAccentize: (text: string) => {
		return text
			.replace(/[ÀÁÂÃÄÅ]/g, 'a')
			.replace(/[àáâãäå]/g, 'a')
			.replace(/[ÈÉÊË]/g, 'e')
			.replace(/[èéêë]/g, 'e')
			.replace(/[ÌÍÎÏ]/g, 'i')
			.replace(/[ìíîï]/g, 'i')
			.replace(/[ÒÓÔÕÖ]/g, 'o')
			.replace(/[òóôõö]/g, 'o')
			.replace(/[ÙÚÛÜ]/g, 'u')
			.replace(/[ùúûü]/g, 'u');
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
	},
	formatFlatpickrDate: (date: Date) => {
		return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
	},
	getDateLocale: (date: Date = new Date()): string => {
		return date.toLocaleDateString('es-ES', {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit'
		});
	},
	getLocalDate: (date: Date | string = new Date()): Date => {
		const dateObj = typeof date === 'string' ? new Date(date) : date;
		const realDate = dateObj ? dateObj : new Date();
		const offset = realDate.getTimezoneOffset() * 60 * 1000;
		const localDate = new Date(realDate.getTime() - offset);
		return localDate;
	},
	getUTCDate: (date: string): Date => {
		const [year, month, day] = date.split('-').map(Number);
		return new Date(Date.UTC(year, month - 1, day));
	},
	getBrandImage: (brand: string): string => {
		const searchBrand = brand.toLowerCase().replace(/ /g, '-');
		const foundBrand = brands[searchBrand];
		return foundBrand ? foundBrand.image : '';
	},
	extractBracketGroup(formData: FormData, baseName: string): Record<string, string> {
		const result: Record<string, string> = {};

		for (const [key, value] of formData.entries()) {
			const regex = new RegExp(`^${baseName}\\[(.+?)\\]$`);
			const match = key.match(regex);
			if (match) {
				result[match[1]] = value as string;
			}
		}

		return result;
	},
	arrayIdToMap<T extends { id: number | string }>(items: T[]) {
		return new Map(items.map(i => [i.id, i] as const));
	},
	readCsvContent,
	createCsv,
	getArrayFormDatas,
	getRandomNumberBetween
};
