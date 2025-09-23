import { PpvCardRepository } from '$lib/server/dao/repositories/matchcard.repository';
import { Helpers } from '$lib/server/server.helpers';

export const actions = {
	default: async ({ request }) => {
		const formData = await request.formData();

		try {
			const file = formData.get('matchcard-event') as File;
			if (!file) return Helpers.error('No se ha proporcionado ningún archivo', 400);

			const text = await file.text();
			if (!text) return Helpers.error('El archivo está vacío', 400);

			const json = JSON.parse(text);
			if (!json) return Helpers.error('El archivo no contiene un JSON válido', 400);

			const matchcardRepository = new PpvCardRepository();
			const matchesRepository = matchcardRepository.getMatchesRepository();

			const existCardWithSameName = await matchcardRepository.getRow({
				where: { ppv_name: json.ppv_name }
			});
			if (existCardWithSameName)
				return Helpers.error(
					`Ya existe una tarjeta de evento con el nombre "${json.ppv_name}"`,
					400
				);

			const createdPPV = await matchcardRepository.create({
				ppv_name: json.ppv_name,
				ppv_image: json.ppv_image,
				ppv_date: new Date(json.ppv_date),
				created_at: new Date(json.created_at),
				updated_at: new Date(json.updated_at),
				matches: {
					create: json.matches
				}
			});
			if (!createdPPV.id) return Helpers.error('No se ha podido crear el matchcard', 500);
			return Helpers.success('Matchcard creado con éxito', 201);
		} catch (error) {
			console.error('Error al importar el archivo:', error);
			return Helpers.error('Error al procesar el archivo', 500);
		}
	}
};
