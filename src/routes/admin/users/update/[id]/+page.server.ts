import bcrypt from 'bcryptjs';
import { UsersDao } from '$lib/server/dao/users.dao.js';
import prisma from '$lib/server/prisma.js';
import { Helpers } from '$lib/server/server.helpers.js';
import fs from 'fs';

export const load = async ({ locals, params }) => {
	if (!Helpers.hasPermission(locals)) throw Helpers.redirection('/');

	const id = decodeURIComponent(params.id);
	if (!id) throw Helpers.redirection('/');
	if (Number(id) === 1) throw Helpers.redirection('/admin/users');

	const user = await UsersDao.getUserById(id);
	if (!user) throw Helpers.redirection('/');

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
		const passwords = {
			password: formData.get('password') as string,
			password_confirmation: formData.get('password_confirmation') as string
		};
		if (passwords.password && passwords.password !== passwords.password_confirmation)
			return Helpers.error('Las contraseñas no coinciden', 400);

		if (!formData.has('role')) return Helpers.error('Un usuario debe tener un rol', 400);

		const hasMarketing = Helpers.getToggleInput(formData, 'user_marketing_notifications');

		fs.writeFileSync(
			'./src/routes/admin/users/update-datas-log.json',
			JSON.stringify(submittedDatas, null, 5)
		);

		try {
			const data: Record<string, any> = {
				username: submittedDatas.username,
				name: submittedDatas.name,
				email: submittedDatas.email,
				type: submittedDatas.role,
				newsletter_subscription: hasMarketing,
				image: submittedDatas.image
			};
			if (passwords.password) {
				data.password = bcrypt.hashSync(passwords.password, 10);
			}

			const updatedUser = await prisma.user.update({
				where: { id: updateId },
				data: data
			});

			if (updatedUser) return Helpers.success('Usuario actualizado correctamente', 200);
			return Helpers.error('No se ha podido actualizar el usuario', 400);
		} catch (error) {
			if (error instanceof Error) return Helpers.error(error.message, 400);
		}
	}
};
