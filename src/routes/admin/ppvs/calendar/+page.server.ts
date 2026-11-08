import { ppv } from '$lib/server/dao/repositories';

export const load = async () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const events = await ppv.get({
        select: { id: true, name: true, game_date: true, image: true },
        where: {
            active: true,
            game_date: { gte: new Date(year, 0, 1), lt: new Date(year, 11, 31) },
        },
        orderBy: { game_date: 'asc' }
    });

    const ppvs = events.map((event) => ({
        id: event.id,
        name: event.name,
        iso: event.game_date!.getCustomIsoFormat(false),
        date: event.game_date!,
        type: 'ppv',
        day: event.game_date!.getDate(),
        image: event.image as string,
    }));

    // const yearlyPpvs = Object.groupBy(ppvs, (event) => event.iso);
    const yearlyPPVs = Object.fromEntries(ppvs.map((event) => [event.iso, event]));

    return {
        year,
        month,
        today: now.getDate(),
        yearlyPPVs,
        ppvs: ppvs
    };
};
