import { Utils } from '$lib/utils/general.utils.js';
import { InjuriesRepository } from '$lib/server/dao/repositories/injuries.repository';

const normalizeDate = (value: Date | string | null) => {
	if (!value) return null;
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return null;
	date.setUTCHours(0, 0, 0, 0);
	return date;
};

const getSeverityLabel = (severity: string | null) => {
	const labels: Record<string, string> = {
		low: 'Leve',
		medium: 'Moderada',
		high: 'Grave'
	};

	if (!severity) return 'Sin indicar';
	return labels[severity.toLowerCase()] || severity;
};

const getDaysLabel = (startDate: Date | null, endDate: Date | null) => {
	if (!startDate || !endDate) return 'Sin rango';

	const days = Math.max(0, Math.round((endDate.getTime() - startDate.getTime()) / 86400000));
	return `${days} dias`;
};

export const load = async () => {
	const today = new Date();
	const Injuries = new InjuriesRepository();
	const injuriesList = await Injuries.get({
		include: { Wrestler: { select: { id: true, name: true, image_name: true } } }
	});

	return {
		injuries: injuriesList.map((injury) => {
			const startDate = normalizeDate(injury.start_date);
			const endDate = normalizeDate(injury.end_date);
			const isPast = Boolean(endDate && endDate < today);

			return {
				...injury,
				start: Utils.toShortDate(startDate),
				end: Utils.toShortDate(endDate),
				isPast,
				isCurrent: !isPast,
				statusLabel: isPast ? 'Pasada' : 'Actual',
				severityLabel: getSeverityLabel(injury.severity),
				durationLabel: getDaysLabel(startDate, endDate),
				postLabel: injury.post_id ? `Post #${injury.post_id}` : 'Sin post'
			};
		})
	};
};
