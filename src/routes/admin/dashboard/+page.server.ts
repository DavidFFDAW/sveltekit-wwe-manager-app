export const load = async ({ locals }) => {
	console.log('Admin dashboard log: ', {
		locals: locals.user?.username
	});
};
