import type { RequestHandler } from './$types';
import { CRON_JOB_SECRET } from '$env/static/private';
import { InjuriesRepository } from '$lib/server/dao/repositories/injuries.repository';
import { UsersRepository } from '$lib/server/dao/repositories/users.repository';
import { Helpers } from '$lib/server/server.helpers';

const injuryResponse = (message: BodyInit, init: ResponseInit) => {
	console.log({
		message,
		init
	});
	return new Response(message, init);
}

export const GET: RequestHandler = async ({ request }) => {
	const authHeader = request.headers.get('Authorization');
	if (!request.headers.has('Authorization') || authHeader !== `Bearer ${CRON_JOB_SECRET}`)
		return injuryResponse('Unauthorized', { status: 401 });

	// Siempre trabajamos con la hora de ejecución que tiene el cron
	const today = new Date();
	today.setUTCHours(1, 30, 0, 0);
	console.log('Today ISO:', today.toISOString());


	try {
		const Injuries = new InjuriesRepository();
		const Users = new UsersRepository();
		const finishedInjuries = await Injuries.get({
			where: {
				end_date: {
					lte: today
				},
				is_notified: false
			},
			include: {
				Wrestler: {
					select: {
						name: true,
					}
				}
			}
		}) as any[];

		console.log({
			finishedInjuriesFound: finishedInjuries.length,
		});

		if (finishedInjuries.length <= 0)
			return injuryResponse('No se encontró ninguna lesión que haya finalizado.', { status: 200 });

		const injuriesIds = finishedInjuries.map((injury) => injury.id);
		await Injuries.bulkUpdate(
			{ id: { in: injuriesIds } },
			{ is_notified: true }
		);

		const admins = await Users.getUsersBaseDataByRole('admin');
		const wrestlers = finishedInjuries.map(injury => injury.Wrestler.name);
		const emails = admins.map(user => user.email);

		const listFormatter = new Intl.ListFormat('es', { style: 'long', type: 'conjunction' });
		const wrestlerNames = listFormatter.format(wrestlers);

		const message = wrestlers.length > 1
			? `Los luchadores ${wrestlerNames} se han recuperado de las lesiones que tenían y están listos para volver a la programación habitual.`
			: `El luchador ${wrestlerNames} se ha recuperado de sus lesiones y está completamente recuperado y listo para volver a ser incluído en la programación.`

		console.log({
			emails,
			message,
			wrestlerNames,
		});

		const response = await Helpers.sendSimpleEmail(
			emails,
			'Recuperación lesiones',
			message
		);

		console.log({
			email_response: response
		});


		return injuryResponse(`Se han revisado las lesiones. Se han notificado la finalización de ${injuriesIds.length} lesiones.`, { status: 200 });
	} catch (error) {
		console.error('Error in check-injuries cronjob:', error);
		return injuryResponse('Ha habido un error interno. Revisa los logs o habla con tu administrador/proveedor para ver qué podría estar ocurriendo', { status: 500 });
	}
};