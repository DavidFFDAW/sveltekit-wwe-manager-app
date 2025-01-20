import jsonwebtoken from 'jsonwebtoken';
import { JWT_SECRET_KEY } from '$env/static/private';

export const JWT = {
	sign: (payload: string | object | Buffer, expiration: number) => {
		return jsonwebtoken.sign(payload, JWT_SECRET_KEY, {
			// expires in 7 days
			expiresIn: expiration || 3600 * 24 * 7
		});
	},
	verify: (token: string) => {
		try {
			return jsonwebtoken.verify(token, JWT_SECRET_KEY);
		} catch (error) {
			return false;
		}
	}
};
