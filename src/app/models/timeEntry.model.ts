export interface TimeEntry {
    id?: number;
    spent_date?: string;
    user?: any;
    user_assignment?: any;
    client?: any;
    project?: any;
    task?: any;
    task_assignment?: any;
    external_reference?: any;
    invoice?: any;
    hours?: number;
    notes?: string;
    is_locked?: boolean;
    locked_reason?: string;
    is_closed?: boolean;
    is_billed?: boolean;
    timer_started_at?: boolean;
    started_time?: string;
    ended_time?: string;
    is_running?: boolean;
    billable?: boolean;
    budgeted?: boolean;
    billable_rate?: number;
    cost_rate?: number;
    created_at?: string;
    updated_at?: string;
}
