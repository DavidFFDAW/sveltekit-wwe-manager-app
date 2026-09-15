import { DateUtils } from '$lib/utils/date.utils';
import { Helpers } from '$lib/server/server.helpers.js';
import { json } from '@sveltejs/kit';

export async function GET({ url }) {
	const params = url.searchParams;
	const timestamp = params.has('timestamp') ? params.get('timestamp') as string : '';
	if (typeof timestamp !== 'string')
		return Helpers.api.json({
			message: 'Ha habido un error con el parametro',
			timestamp,
			params
		}, 500);

	const date = new Date(timestamp);
	const debug: Record<string, any> = {
		date,
		date_iso: date.toISOString(),
		date_locale: date.toLocaleString('es-ES'),
		date_format: DateUtils.format(date, 'Y-m-d H:i:s'),
	};

	return json({
		debug
	}, { status: 200, statusText: 'Completed' });
}
