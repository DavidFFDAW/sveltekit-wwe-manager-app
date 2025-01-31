import { WrestlerDao } from '$lib/server/dao/wrestler.dao';
import { Helpers } from '$lib/server/server.helpers';

export async function POST({ locals }) {
    if (!Helpers.hasPermission(locals, 'admin'))
        return Helpers.apiResponseMessage('No tienes permisos para realizar esta acción', 403);

    try {
        const wrestlers = await WrestlerDao.getWrestlers();
        const updatedWrestlers = wrestlers.map(wrestler => {
            wrestler.slug = Helpers.slugify(wrestler.name) as string;
            return wrestler;
        });
        //

        await Promise.all(
            updatedWrestlers.map(wrestler => WrestlerDao.updatePartialWrestler({ slug: wrestler.slug }, wrestler.id)),
        );
        return Helpers.apiResponseMessage('Se han actualizado los slugs para todos los posts', 200);
    } catch (error) {
        if (error instanceof Error) return Helpers.apiResponseMessage(error.message, 500);
        return Helpers.apiResponseMessage('Un error desconocido ha ocurrido', 500);
    }
}
