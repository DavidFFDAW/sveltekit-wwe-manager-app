import type { JwtPayload } from 'jsonwebtoken';

export interface UserLoginPayload extends JwtPayload {
	uuid: number;
	name: string;
	email: string;
	role: string;
	username: string;
	token: string;
}
