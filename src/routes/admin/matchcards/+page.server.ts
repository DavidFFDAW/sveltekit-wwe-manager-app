import { Utils } from '$lib/utils/general.utils.js';
import { PpvCardRepository } from '$lib/server/dao/repositories/matchcard.repository.js';
import { Helpers } from '$lib/server/server.helpers.js';

type MatchCardWithStats = {
    id: number;
    id_match_card: number;
    ppv_name: string;
    ppv_date: Date;
    ppv_image: string | null;
    post_id: number | null;
    matches: number;
    average: number;
    nights: number;
    hasSummaryPost: boolean;
};

export const load = async ({ url }) => {
    const searchParams = url.searchParams;
    const yearFilter = searchParams.has('year') ? searchParams.get('year') : new Date().getFullYear();

    const dateFrom = new Date(`${yearFilter}-01-01`);
    const dateTo = new Date(`${yearFilter}-12-31`);

    const ppvCardRepository = new PpvCardRepository();
    const uniqueYears = await ppvCardRepository.getUniquePpvYears();

    const prisma = ppvCardRepository.conn();
    const rows = await prisma.$queryRaw<MatchCardWithStats[]>`
		SELECT
            p.id AS id,
			m.id_match_card,
			p.ppv_name,
			p.ppv_date,
			p.ppv_image,
            p.post_id,
			COUNT(m.id) as matches,
			ROUND(AVG(m.rating), 1) as average,
			MAX(m.night) as nights
		FROM matchs m
		RIGHT JOIN ppv_card p ON p.id = m.id_match_card
		WHERE p.ppv_date >= ${dateFrom}
			AND p.ppv_date <= ${dateTo}
		GROUP BY m.id_match_card, p.id, p.ppv_name, p.ppv_date, p.ppv_image, p.post_id
		ORDER BY p.ppv_date ASC
	`;

    const parsedRows = rows.map((row) => ({
        ...row,
        hasSummaryPost: Boolean(row.post_id),
        matches: Number(row.matches),
        average: Number(row.average),
        formatted_date: Utils.formatDate(row.ppv_date),
        nights: Number(row.nights)
    }));

    return {
        matchcards: parsedRows,
        uniqueYears: uniqueYears,
        selectedYear: yearFilter ? Number(yearFilter) : null
    };
};

export const actions = {
    default: async ({ request }) => {
        const formData = await request.formData();

        try {
            const id = formData.get('delete_event');
            const matchcards = new PpvCardRepository();
            await matchcards.delete({
                id: Number(id)
            });

            return Helpers.success('Evento eliminado correctamente');
        } catch (error) {
            console.error('Error processing form data:', error);
            return Helpers.error('Error processing form data');
        }
    }
}