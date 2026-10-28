import { ppv } from "$lib/server/dao/repositories";

export const load = async () => {
	return {
		ppvs: await ppv.getActiveNames()
	};
}