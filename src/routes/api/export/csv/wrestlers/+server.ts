import { WrestlerDao } from '$lib/server/dao/wrestler.dao';
import { Helpers } from '$lib/server/server.helpers';

export async function GET({ locals, url }) {
    if (!Helpers.hasPermission(locals))
        return Helpers.apiResponseMessage('No tienes permisos suficientes para realizar esta acción', 403);

    const separator = url.searchParams.has('separator') ? (url.searchParams.get('separator') as string) : ',';
    const wrestlers = await WrestlerDao.getWrestlers();
    if (!wrestlers || wrestlers.length <= 0) return Helpers.apiResponseMessage('No se han encontrado luchadores', 404);

    // create csv and download it on the client side
    const csvHeaders = Object.keys(wrestlers[0]).join(separator);
    const csv = wrestlers.map(wrestler => {
        return Object.values(wrestler).join(separator);
    });

    const csvData = `${csvHeaders}\n${csv.join('\n')}`;
    return Helpers.apiResponse({ csv: csvData }, 200);
}
