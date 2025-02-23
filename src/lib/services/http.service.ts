const _makeRequest = async (url: string, method: string, options?: RequestInit) => {
	const httpOptions: RequestInit = {
		method,
		mode: 'cors',
		...options
	};

	if (method === 'GET' || method === 'DELETE') {
		httpOptions.headers = {
			'Content-Type': 'application/json',
			...httpOptions.headers
		};
	}

	const response = await fetch(url, httpOptions);
	return {
		ok: response.ok,
		status: response.status,
		response: (await response.json()) as Record<string, any>
	};
};

export const HttpService = {
	get: (url: string) => _makeRequest(url, 'GET'),
	post: (url: string, options?: RequestInit) => _makeRequest(url, 'POST', options),
	put: (url: string, options?: RequestInit) => _makeRequest(url, 'PUT', options),
	delete: (url: string) => _makeRequest(url, 'DELETE')
};
