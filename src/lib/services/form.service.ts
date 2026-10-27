export class FormService {
	constructor(private readonly datas: FormData) { }

	public static async fromRequest(request: Request): Promise<FormService> {
		const formData = await request.formData();
		return new FormService(formData);
	}

	public getAll(key: string): string[] {
		return this.datas.getAll(key).filter(item => item && !(item instanceof File)).map(p => p.toString().trim()).filter(Boolean);
	}
	public get(key: string, defaultValue: string = ''): string {
		if (!this.datas.has(key)) return defaultValue;
		return this.datas.get(key)!.toString().trim();
	}
	public getOrNull(key: string, defaultValue: string | null = null): string | null {
		if (!this.datas.has(key)) return defaultValue;
		return this.datas.get(key)?.toString().trim() ?? defaultValue;
	}
	public getNumber(key: string): number {
		return Number(this.get(key));
	}
	public getToggle(key: string, value: string = 'on'): boolean {
		return this.get(key) === value;
	}
	public getInputDateFormat(date: Date | null): string {
		const inptDate = date ? new Date(date) : new Date();
		return `${inptDate.getFullYear()}-${String(inptDate.getMonth() + 1).padStart(2, '0')}-${String(inptDate.getDate()).padStart(2, '0')}`;
	}
	public getDate(field: string): Date {
		const date = this.get(field);
		return date ? new Date(date) : new Date();
	}
	public getUpdateId(): number {
		if (!this.datas.has('_update_id')) return 0;
		return this.getNumber('_update_id');
	}
	public getDeleteId(): number {
		if (!this.datas.has('delete_id')) return 0;
		return this.getNumber('delete_id');
	}
	public getFormAction(): string {
		if (!this.datas.has('action')) return '';
		return this.get('action').toLowerCase().trim();
	}
	public isFormUpdate(updateId: number, action: string): boolean {
		return Number.isInteger(updateId) && updateId > 0 && action === 'update';
	}
	public getUpsertState() {
		const updateId = this.getUpdateId();
		const action = this.getFormAction();

		return {
			isUpdate: this.isFormUpdate(updateId, action),
			updateId: updateId,
			action: action,
		};
	}
	public checkRequiredFields(requiredFields: string[]): { error: boolean; message: string } {
		const missingFields = requiredFields.filter(field => !this.datas.has(field) || !this.get(field));
		if (missingFields.length > 0) {
			return { error: true, message: `Faltan campos requeridos: ${missingFields.join(', ')}` };
		}
		return { error: false, message: '' };
	}
	public entries() {
		return Object.fromEntries(this.datas.entries());
	}
	public getFormData(): FormData {
		return this.datas;
	}
}

export default FormService