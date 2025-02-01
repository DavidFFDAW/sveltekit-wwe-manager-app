export interface WrestlerObject {
	name: string;
	alias: string | null;
	slug: string;
	brand: string;
	status: string;
	is_tag?: boolean | null;
	is_champ?: boolean | null;
	twitter_acc: string;
	twitter_name: string;
	finisher: string;
	overall: number;
	image_name: string | null;
	sex: string;
	kayfabe_status: string | null;
	twitter_image: string | null;
	categories: string | null;
}

export interface BlogObject {
	title: string;
	slug: string;
	image?: string;
	content: string;
	admin_id: number;
	created_at?: Date;
	updated_at?: Date;
	exceptr?: string;
	visible?: boolean;
	category?: string;
	deletable?: boolean;
}
