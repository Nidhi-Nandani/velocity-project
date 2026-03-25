import { create } from 'zustand';
import type { Task, FilterState, Presence, User, Status } from '../types';
import { generateMockTasks, USERS } from '../utils/mockData';

interface TaskStore {
  tasks: Task[];
  filters: FilterState;
  presences: Presence[];
  activeUsers: User[];
  
  // Actions
  setTasks: (tasks: Task[]) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  moveTask: (taskId: string, newStatus: Status) => void;
  setFilters: (updates: Partial<FilterState>) => void;
  clearFilters: () => void;
  updatePresence: (presences: Presence[]) => void;
}

const initialFilters: FilterState = {
  status: [],
  priority: [],
  assignees: [],
  dueDateRange: {
    from: null,
    to: null,
  },
};

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: generateMockTasks(500),
  filters: initialFilters,
  presences: [],
  activeUsers: USERS.slice(0, 4),

  setTasks: (tasks) => set({ tasks }),
  
  updateTask: (taskId, updates) => set((state) => ({
    tasks: state.tasks.map((t) => t.id === taskId ? { ...t, ...updates } : t)
  })),

  moveTask: (taskId, newStatus) => set((state) => ({
    tasks: state.tasks.map((t) => t.id === taskId ? { ...t, status: newStatus } : t)
  })),

  setFilters: (updates) => set((state) => ({
    filters: { ...state.filters, ...updates }
  })),

  clearFilters: () => set({ filters: initialFilters }),

  updatePresence: (presences) => set({ presences }),
}));
