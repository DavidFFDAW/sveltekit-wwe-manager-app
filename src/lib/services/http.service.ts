type HttpBody = FormData | Record<string, any>;
const _makeRequest = async (url: string, method: string, data?: HttpBody) => {
	const options: RequestInit = {
		method,
		mode: 'cors',
		headers: {
			'Content-Type': 'application/json'
		}
	};
	if (data) options.body = data instanceof FormData ? data : JSON.stringify(data);

	const response = await fetch(url, options);
	return {
		ok: response.ok,
		status: response.status,
		response: (await response.json()) as Record<string, any>
	};
};

export const HttpService = {
	get: (url: string) => _makeRequest(url, 'GET'),
	post: (url: string, data: HttpBody) => _makeRequest(url, 'POST', data),
	put: (url: string, data: HttpBody) => _makeRequest(url, 'PUT', data),
	delete: (url: string) => _makeRequest(url, 'DELETE')
};
