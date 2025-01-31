import { BlogDao } from '$lib/server/dao/blog.dao';
import { Helpers } from '$lib/server/server.helpers.js';

export async function POST({ locals, params }) {
	if (!Helpers.hasPermission(locals))
		return Helpers.apiResponseMessage('No tienes permisos para realizar esta acción', 403);

	const { id } = params;
	if (!id || isNaN(Number(id))) return Helpers.apiResponseMessage('ID inválido', 400);

	const post = await BlogDao.getPostById(Number(id));
	if (!post) return Helpers.apiResponseMessage('Publicación no encontrada', 404);

	await BlogDao.updatePublish(post.id, !post.visible);
	return Helpers.apiResponseMessage('Publicación actualizada', 200);
}
