import type { Wrestler } from '@prisma/client';

export class ChoosingAlgorithm {
	private static highOverall = 90;

	private static getRandomWrestler(elegibleList: Wrestler[]): Wrestler {
		const randomIndex = Math.floor(Math.random() * elegibleList.length);
		return elegibleList[randomIndex];
	}

	public static getOpposingBrandSelectedWrestler(
		mySelection: Wrestler,
		elegibleList: Wrestler[],
		currentOpposingBrandRoster: Wrestler[]
	): Wrestler | null {
		// Si hay luchadores con overall mayor o igual a 90, se selecciona uno de ellos
		if (mySelection.status === 'manager') {
			const managers = elegibleList.filter((w) => w.status === 'manager');
			if (managers.length > 0) return this.getRandomWrestler(managers);
		}

		// const teamsMembers = currentOpposingBrandRoster
		// 	.filter((w) => {
		// 		console.log('w', w.name);
		// 		return w.hasTeam;
		// 	})
		// 	.map((w) => [...w.members]);

		// console.log('teamsMembers', teamsMembers);

		const highestOveralls = elegibleList.filter((w) => w.overall >= this.highOverall);
		if (highestOveralls.length > 0) return this.getRandomWrestler(highestOveralls);

		const alikeOveralls = elegibleList.filter((w) => {
			const isInOverall =
				w.overall >= mySelection.overall - 5 && w.overall <= mySelection.overall + 5;
			return isInOverall;
		});

		if (alikeOveralls.length > 0) return this.getRandomWrestler(alikeOveralls);

		// Si no hay luchadores con overall similar, se selecciona uno al azar
		return this.getRandomWrestler(elegibleList);
	}
}
