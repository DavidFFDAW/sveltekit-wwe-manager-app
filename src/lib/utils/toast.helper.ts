import { toast } from '@zerodevx/svelte-toast';

export const Toast = {
    success: (message: string) => {
        return toast.push(message, {
            theme: { '--toastBackground': '#deffec', '--toastColor': '#333' },
        });
    },
    error: (message: string) => {
        return toast.push(message, {
            theme: { '--toastBackground': '#fde7e7', '--toastColor': '#333' },
        });
    },
    info: (message: string) => {
        return toast.push(message, {
            theme: { '--toastBackground': '#d1ecf1', '--toastColor': '#333' },
        });
    },
};
