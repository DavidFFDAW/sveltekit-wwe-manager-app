export interface EmailOptions {
	emails: string | string[];
	html: string;
	subject: string;
	from?: { email: string; name: string };
	body?: string;
	variables: { [key: string]: string };
}