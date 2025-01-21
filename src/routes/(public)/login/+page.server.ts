import { JWT } from '$lib/server/jwt.helper';
import prisma from '$lib/server/prisma';
import { Helpers } from '$lib/server/server.helpers';
import bcrypt from 'bcryptjs';

export const actions = {
	default: async ({ request, cookies }) => {
		const defaultError = 'El usuario o contraseña son incorrectos';
		const form = await request.formData();
		const credentials = {
			email: form.get('email') as string,
			password: form.get('password') as string
		};
		if (!credentials.password || !credentials.email)
			return Helpers.error('Por favor, ingrese su email y contraseña', 400);

		try {
			const foundUser = await prisma.users.findUnique({
				where: {
					email: credentials.email
				}
			});

			if (!foundUser) return Helpers.error(defaultError, 401);

			// Check password
			const passwordMatch = await bcrypt.compare(credentials!.password.trim(), foundUser.password);
			if (!passwordMatch) return Helpers.error(defaultError, 400);

			// Generate token
			const tokenTime = ['admin', 'editor'].includes(foundUser.type) ? 86400 * 30 * 6 : 86400 * 7;
			const jwtToken = JWT.sign(
				{
					uuid: Number(foundUser.id),
					name: foundUser.name,
					email: foundUser.email,
					role: foundUser.type,
					username: foundUser.username
				},
				tokenTime
			);

			// Set cookie
			cookies.set('session', jwtToken, {
				maxAge: tokenTime,
				secure: true,
				sameSite: 'strict',
				httpOnly: true,
				path: '/'
			});

			return Helpers.success('Inicio de sesión exitoso', 200);
		} catch (err: unknown) {
			console.log(err);
			return Helpers.error('Error al intentar iniciar sesión', 500);
		}
	}
};
