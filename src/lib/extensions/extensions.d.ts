export { };

declare global {
    interface Date {
        getCustomIsoFormat(): string;
        getEllapsedTimeBetweenDates(end: Date | null | undefined = new Date()): { days: number; formatted: string };
    }
}
