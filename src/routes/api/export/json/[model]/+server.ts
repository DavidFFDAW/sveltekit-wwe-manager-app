import prisma from '$lib/server/prisma.js';
import { Api } from '$lib/server/server.helpers.js';

export async function GET({ params }) {
	const { model } = params;
	console.log(`Exporting data for model: ${model}`);

	try {
		// List allowed model names as keys of prisma
		const allowedModels = ['blogPost', 'pPV', 'championship']; // replace with your actual model names
		if (!allowedModels.includes(model)) return Api.error('Model not found', 404);

		const prismaModel = (prisma as Record<string, any>)[model];
		if (!prismaModel) return Api.error('Model not found', 404);

		const data = await prismaModel.findMany();
		return Api.json(data);
	} catch (error) {
		console.log(`Error exporting data for model ${model}:`, error);
		return Api.error('Failed to export data', 500);
	}
}
