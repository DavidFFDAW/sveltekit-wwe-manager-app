export class FormUtils {
	public constructor(private fields: FormData) { }

	public get(key: string): string {
		if (!this.fields.has(key)) return '';
		const value = this.fields.get(key)?.toString();
		return value ? value.toString().trim() : '';
	}

	public has = (key: string): boolean => this.fields.has(key) && this.get(key) !== '';
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

	public getUpdateID = () => Number(this.get('_update_id'));
	public getToggleInput = (key: string): boolean => this.get(key) === 'on';
	public getAction = (): string => this.get('_action');

	public checkFields = (requiredFields: string[]) => {
		const missingFields = requiredFields.filter(
			(field) => !this.fields.has(field) || !this.fields.get(field)
		);
		if (missingFields.length > 0)
			return { error: true, message: `Faltan campos requeridos: ${missingFields.join(', ')}` };

		return { error: false, message: '' };
	}

	public checkFieldsThrow = (requiredFields: string[]) => {
		const { error, message } = this.checkFields(requiredFields);
		if (error) throw new Error(message);
	}

	public getEntries = () => {
		this.fields.entries().map(entry => { })
	}
}