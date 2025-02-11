import { UsersDao } from '$lib/server/dao/users.dao.js';
import prisma from '$lib/server/prisma.js';
import { Helpers } from '$lib/server/server.helpers.js';
import fs from 'fs';

export const load = async ({ locals, params }) => {
	if (!Helpers.hasPermission(locals)) throw Helpers.redirection('/');

	const id = decodeURIComponent(params.id);
	if (!id) throw Helpers.redirection('/');

	const user = await UsersDao.getUserById(id);
	if (!user) throw Helpers.redirection('/');
	if (user.type === 'admin') throw Helpers.redirection('/admin/users');

	return { user: user };
};

export const actions = {
	default: async ({ request, locals }) => {
		if (!Helpers.hasPermission(locals))
			return Helpers.error('No tienes permisos para realizar esta acción', 403);

		const formData = await request.formData();
		const updateId = Helpers.getUpdateID(formData);
		if (!updateId) return Helpers.error('No se ha podido actualizar el usuario', 400);

		const submittedDatas = Object.fromEntries(formData.entries());
		if (!formData.has('role')) return Helpers.error('Un usuario debe tener un rol', 400);

		const hasMarketing = Helpers.getToggleInput(formData, 'user_marketing_notifications');

		fs.writeFileSync(
			'./src/routes/admin/users/update-datas-log.json',
			JSON.stringify(submittedDatas, null, 5)
		);

		try {
			const updatedUser = await prisma.user.update({
				where: { id: updateId },
				data: {
					username: formData.get('username') as string,
					name: formData.get('name') as string,
					email: formData.get('email') as string,
					type: formData.get('role') as string,
					newsletter_subscription: hasMarketing
				}
			});

			if (updatedUser) return Helpers.success('Usuario actualizado correctamente', 200);
			return Helpers.error('No se ha podido actualizar el usuario', 400);
		} catch (error) {
			if (error instanceof Error) return Helpers.error(error.message, 400);
		}
	}
};
