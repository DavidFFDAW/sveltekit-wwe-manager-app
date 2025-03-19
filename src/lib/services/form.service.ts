export const sendRequest = async (action: string, method: string, formData: FormData) => {
	const response = await fetch(action, {
		method: method.toUpperCase(),
		body: formData,
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		}
	});

	return {
		response,
		content: await response.json()
	};
};
