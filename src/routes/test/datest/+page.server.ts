export const load = async () => {
	const date = new Date();
	const iso = date.ww_getIso();

	return {
		test: {
			date,
			iso,
		}
	};
}