import { TaskAssignment } from '@app/models/task.model';

export interface ProjectAssignment {
    id: number;
    is_active: boolean;
    is_project_manager: boolean;
    hourly_rate: number;
    budget: number;
    created_at: string;
    updated_at: string;
    project: { id: number, name: string, code: string }
    client: any;
    task_assignments: TaskAssignment[];
}