// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
    namespace App {
        interface Locals {
            user?: {
                uuid: number;
                name: string;
                email: string;
                role: string;
                username: string;
            };
        }
        // interface Error {}
        // interface Locals {}
        // interface PageData {}
        // interface PageState {}
        // interface Platform {}
    }
}

export {};
