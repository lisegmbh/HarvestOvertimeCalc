export interface TaskAssignment {
    id: number;
    project: { id: number, name: string, code: string; };
    task: { id: number, name: string };
    is_active: boolean;
    billable: boolean;
    hourly_rate: number;
    budget: number;
    created_at: number;
    updated_at: number;
}