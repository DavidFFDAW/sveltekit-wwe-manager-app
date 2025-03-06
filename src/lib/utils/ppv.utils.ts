import type { PPV } from '@prisma/client';

export const PPVUtils = {
    orderPPVsByMonthAndDay: (ppvs: PPV[]) => {
        return ppvs.sort((a, b) => {
            const dateA = a.game_date as Date;
            const dateB = b.game_date as Date;
            if (!dateA || !dateB) return 0;

            const [monthA, dayA] = [dateA.getMonth(), dateA.getDate()];
            const [monthB, dayB] = [dateB.getMonth(), dateB.getDate()];

            return monthA - monthB || dayA - dayB;
        });
    },
};
