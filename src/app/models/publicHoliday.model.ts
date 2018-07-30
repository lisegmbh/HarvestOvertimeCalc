export interface PublicHoliday {
    date: string;
    start: Date;
    end: Date;
    name: string;
    type: string;
    substitute: boolean;
    note: string;
}