import { ReignsRepository } from '$lib/server/dao/repositories/reigns.repository.js';
import { Api } from '$lib/server/server.helpers';

export const GET = async () => {
    try {
        const reignsRepo = new ReignsRepository();
        const currentReigns = await reignsRepo.get({
            where: {
                current: true,
                lost_date: null,
            },
        });

        const today = new Date();
        // get reign days duration
        const updatedReigns = currentReigns.map(reign => {
            const reignDuration = Math.floor((today.getTime() - reign.won_date.getTime()) / (1000 * 60 * 60 * 24));
            return {
                ...reign,
                reign_days_duration: reignDuration,
            };
        });
        await Promise.all(
            updatedReigns.map(reign => {
                return reignsRepo.updateById(reign.id, { days: reign.reign_days_duration });
            }),
        );
        return Api.success(`Actualizados ${updatedReigns.length} reinados`);
    } catch (error) {
        console.log(error);
        return Api.error('An unexpected error has occured. Contact your administrator.');
    }
};
