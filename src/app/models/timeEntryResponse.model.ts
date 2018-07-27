import { TimeEntry } from '@app/models/timeEntry.model';

export interface TimeEntryResponse {
    time_entries: TimeEntry[];
    links: { first: string, last: string, previous: string, next: string};
    page: number;
    total_pages: number;
}
