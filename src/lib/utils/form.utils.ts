export class FormUtils {
	public constructor(private fields: FormData) { }

	public get(key: string): string {
		if (!this.fields.has(key)) return '';
		const value = this.fields.get(key)?.toString();
		return value ? value.toString().trim() : '';
	}

	public has = (key: string): boolean => this.get(key) !== '';
	public normalize = (text: string) => text.trim().replace(/\[\]$/, '').replace(/\s+/g, '_').toLowerCase();

	public getNumber = (key: string, fallback: number = 0): number => {
		const parsed = Number(this.get(key));
		return Number.isFinite(parsed) ? parsed : fallback;
	}

	public getDate = (key: string): Date => {
		const iso = this.get(key);
		if (!(/\d{4}-[01]\d-[0-3]\d/.test(iso))) return new Date();

		return new Date(iso);
	}

	public getBoolean = (key: string): boolean => {
		const parsed = this.get(key).toLowerCase();
		return ['1', 'true', 'on', 'yes', 'active', 'visible', 'checked'].includes(parsed);
	}

	public getUpdateID = () => Number(this.get('_update_id'));
	public getToggleInput = (key: string): boolean => this.get(key) === 'on';
	public getAction = (): string => this.get('_action');
}