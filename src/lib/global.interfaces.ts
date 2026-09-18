export type Emails = string[] | string;
export interface EmailBaseOptions {
    to: string[];
    body: string;
    subject: string;
    from?: string;
}
export interface EmailOptions {
    emails: string | string[];
    html: string;
    subject: string;
    body: string;
    from?: string;
    variables?: { [key: string]: string };
}

export interface EmailResponse {
    code: number;
    error: string | boolean;
    message: string;
    is_error: boolean;
}
