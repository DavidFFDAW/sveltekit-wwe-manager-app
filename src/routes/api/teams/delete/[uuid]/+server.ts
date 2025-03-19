import { Api } from '$lib/server/api.helpers';
import { TeamsDao } from '$lib/server/dao/teams.dao.js';

export async function DELETE({ params }) {
	const uuid = Number(params.uuid);
	if (!uuid) return Api.error('Falta el identificador del equipo');
	if (Number.isNaN(uuid)) return Api.error('Identificador de equipo no válido');

	try {
		const deletedTeam = await TeamsDao.deleteTeam(uuid);
		if (deletedTeam) return Api.success(`Equipo ${deletedTeam.slug} borrado correctamente`);
	} catch (error) {
		console.error('Error al borrar el equipo', error);
		return Api.error('Error al borrar el equipo');
	}
}
