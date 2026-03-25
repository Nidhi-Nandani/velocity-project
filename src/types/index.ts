export type Priority = 'Low' | 'Medium' | 'High' | 'Critical';
export type Status = 'To Do' | 'In Progress' | 'In Review' | 'Done';

export interface User {
  id: string;
  name: string;
  initials: string;
  color: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  assignee: User;
  startDate?: string;
  dueDate: string;
}

export interface FilterState {
  status: Status[];
  priority: Priority[];
  assignees: string[];
  dueDateRange: {
    from: string | null;
    to: string | null;
  };
}

export interface Presence {
  userId: string;
  taskId: string;
}
