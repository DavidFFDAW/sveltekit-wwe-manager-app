import {
	IMGUR_ACCOUNT_USERNAME,
	IMGUR_CLIENT_ID,
	IMGUR_CLIENT_SECRET,
	IMGUR_REFRESH_TOKEN
} from '$env/static/private';
import type { Cookies } from '@sveltejs/kit';

export interface ImgurRequestProps {
	method: 'GET' | 'POST' | 'PUT' | 'DELETE';
	endpoint: string;
	body?: FormData | string;
	token?: string;
	extraHeaders?: HeadersInit;
}

export const imgurRequest = async (props: ImgurRequestProps) => {
	const { method, endpoint, body, token, extraHeaders } = props;
	const headers = new Headers({
		Authorization: `Bearer ${token}`,
		...extraHeaders
	});

	const options = {
		method,
		headers,
		mode: 'cors'
	} as RequestInit;

	if (method !== 'GET' && method !== 'DELETE')
		options.body = body instanceof FormData ? body : JSON.stringify(body);

	const response = await fetch(`https://api.imgur.com/${endpoint}`, options);
	// console.log('Request to imgur', `https://api.imgur.com/${endpoint}`, options);

	return {
		ok: response.ok,
		status: response.status,
		response: (await response.json()) as Record<string, unknown>
	};
};

export const ImgurServerService = {
	cookieName: 'imgur_access_token',
	getAndSaveAccessToken: async (cookies: Cookies) => {
		const formData = new FormData();
		formData.set('refresh_token', IMGUR_REFRESH_TOKEN);
		formData.set('client_id', IMGUR_CLIENT_ID);
		formData.set('client_secret', IMGUR_CLIENT_SECRET);
		formData.set('grant_type', 'refresh_token');

		const storedToken = cookies.get('imgur_access_token');
		if (storedToken) return storedToken;

		const result = await imgurRequest({
			method: 'POST',
			endpoint: 'oauth2/token',
			body: formData
		});

		if (!result.ok || !result.response.access_token)
			return new Error('No se ha podido obtener un token de acceso');

		cookies.set('imgur_access_token', result.response.access_token as string, {
			httpOnly: true,
			secure: true,
			path: '/',
			expires: new Date(Date.now() + 3600 * 1000),
			sameSite: 'strict'
		});

		return result.response.access_token as string;
	},

	getUserImages: (token: string) => {
		return imgurRequest({
			method: 'GET',
			endpoint: `3/account/${IMGUR_ACCOUNT_USERNAME}/images`,
			token
		});
	},

	deleteImage: (deleteHash: string, token: string) => {
		return imgurRequest({
			method: 'DELETE',
			endpoint: `3/image/${deleteHash}`,
			token
		});
	},

	uploadImage: (file: File, token: string) => {
		const formData = new FormData();
		formData.append('type', 'file');
		formData.append('image', file);
		formData.append('privacy', 'hidden');
		formData.append('title', file.name);
		formData.append('description', 'Image uploaded from wwe-manager');

		return imgurRequest({
			method: 'POST',
			endpoint: '3/image',
			body: formData,
			token
		});
	}
};
