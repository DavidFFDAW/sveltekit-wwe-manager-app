/** Añade un método no enumerable al prototype; no sobrescribe si ya existe. */
export function defineExtension(proto: object, name: string, fn: (...args: any[]) => any) {
	if (Object.prototype.hasOwnProperty.call(proto, name)) return;
	Object.defineProperty(proto, name, {
		value: fn,
		enumerable: false,
		configurable: true,
		writable: true
	});
}
