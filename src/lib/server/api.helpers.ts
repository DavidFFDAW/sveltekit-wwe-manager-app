import { json } from '@sveltejs/kit';

export const Api = {
	success: (message: string, status: number = 200) => {
		return json(
			{
				message
			},
			{ status }
		);
	},
	error: (message: string, code?: number) => {
		return json({ message }, { status: code || 500 });
	},
	response: (data: Record<string, any>, status: number = 200) => {
		return json(data, { status });
	},
	json: (data: Record<string, any>, status: number = 200) => {
		return json(data, { status });
	}
};
