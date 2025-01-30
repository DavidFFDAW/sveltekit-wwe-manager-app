import { invalidate } from '$app/navigation';
import { Toast } from '$lib/utils/toast.helper';
import type { ActionResult, SubmitFunction } from '@sveltejs/kit';

export const submitForm: SubmitFunction = ({ formData }) => {
	return async ({ result, update }) => {
		const response = result as ActionResult & { data: any };
		const hasError = result.type === 'error' || result.type === 'failure';

		if (hasError) {
			const errorMessage =
				response.data?.message || 'Ha ocurrido un error. Por favor, inténtalo de nuevo más tarde.';
			Toast.error(errorMessage);
		}

		const hasSuccess = !hasError && /20\d/g.test(result.status.toString());

		if (hasSuccess) {
			const successMessage = response.data?.message || '¡Operación exitosa!';
			await update({ reset: false });
			await invalidate(''); // Invalidate the current page to refresh the data
			return Toast.success(successMessage);
		}
	};
};
