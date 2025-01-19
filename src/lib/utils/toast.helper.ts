import { toast } from '@zerodevx/svelte-toast';

export const Toast = {
	success: (message: string) => {
		return toast.push(message, {
			theme: { '--toastBackground': '#00ff00', '--toastColor': '#000' }
		});
	},
	error: (message: string) => {
		return toast.push(message, {
			theme: { '--toastBackground': '#ff0000', '--toastColor': '#fff' }
		});
	}
};
