export const createTestState = (data: any) => {
	let count = $state(0);
	let input = $state('');
	let derived = $derived(`${count}-${input}-derived`);

	const increment = () => {
		count++;
	};
	const decrement = () => {
		count--;
	};

	// Retornar directamente los estados reactivos
	return {
		count, // Esto mantiene la reactividad
		input, // Esto también mantiene la reactividad
		derived, // Esto también mantiene la reactividad
		increment,
		decrement
	};
};
