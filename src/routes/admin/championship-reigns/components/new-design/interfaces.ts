import type {
	UpsertReign,
	UpserReignChampionship,
	UpserReignWrestler,
	UpsertReignTeams
} from '../../interfaces/reigns.interfaces';

export interface UpsertChampionshipReignDatas {
	reign: UpsertReign;
	championships: UpserReignChampionship[];
	wrestlers: UpserReignWrestler[];
	teams: UpsertReignTeams[];
}
