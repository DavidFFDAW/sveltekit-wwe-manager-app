import { IMGUR_CLIENT_ID, IMGUR_CLIENT_SECRET, IMGUR_REFRESH_TOKEN } from '$env/static/private';

export interface ImgurRequestProps {
	method: 'GET' | 'POST' | 'PUT' | 'DELETE';
	endpoint: string;
	body?: FormData | string;
	token?: string;
}

export const imgurRequest = async (props: ImgurRequestProps) => {
	const { method, endpoint, body, token } = props;
	const headers: HeadersInit = {};
	if (token) headers['Authorization'] = `Bearer ${token}`;

	const options = {
		method,
		headers,
		mode: 'cors'
	} as RequestInit;

	if (method !== 'GET' && method !== 'DELETE')
		options.body = body instanceof FormData ? body : JSON.stringify(body);

	const response = await fetch(`https://api.imgur.com/${endpoint}`, options);

	return {
		ok: response.ok,
		status: response.status,
		response: await response.json()
	};
};

export const ImgurServerService = {
	getAccessToken: () => {
		const formData = new FormData();
		formData.set('refresh_token', IMGUR_REFRESH_TOKEN);
		formData.set('client_id', IMGUR_CLIENT_ID);
		formData.set('client_secret', IMGUR_CLIENT_SECRET);
		formData.set('grant_type', 'refresh_token');

		return imgurRequest({
			method: 'POST',
			endpoint: 'oauth2/token',
			body: formData
		});
	}
};
