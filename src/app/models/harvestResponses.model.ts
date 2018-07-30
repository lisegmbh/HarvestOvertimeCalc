import { TimeEntry } from '@app/models/timeEntry.model';
import { ProjectAssignment } from '@app/models/project.model';

export interface TimeEntryResponse {
    time_entries: TimeEntry[];
    links: { first: string, last: string, previous: string, next: string};
    page: number;
    total_pages: number;
}

export interface ProjectAssignmentResponse {
    project_assignments: ProjectAssignment[];
    links: { first: string, last: string, previous: string, next: string};
    page: number;
    total_pages: number;
}
