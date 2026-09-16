export type Emails = string[] | string;
export interface EmailBaseOptions {
	to: string[];
	body: string;
	subject: string;
	from?: { email: string; name: string };
}
export interface EmailOptions {
	emails: string | string[];
	html: string;
	subject: string;
	from?: { email: string; name: string };
	body?: string;
	variables: { [key: string]: string };
}