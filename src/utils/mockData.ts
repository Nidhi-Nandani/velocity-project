import type { Task, User, Priority, Status } from '../types';
import { addDays, format } from 'date-fns';

const USERS: User[] = [
  { id: '1', name: 'Rahul Singh', initials: 'RS', color: '#3b82f6' },
  { id: '2', name: 'Nidhi Singh', initials: 'NS', color: '#ef4444' },
  { id: '3', name: 'Neha Singh', initials: 'NeS', color: '#10b981' },
  { id: '4', name: 'Alok Nawani', initials: 'AN', color: '#f59e0b' },
  { id: '5', name: 'Sakshi Negi', initials: 'SN', color: '#8b5cf6' },
];

const PRIORITIES: Priority[] = ['Low', 'Medium', 'High', 'Critical'];
const STATUSES: Status[] = ['To Do', 'In Progress', 'In Review', 'Done'];

export const generateMockTasks = (count: number = 500): Task[] => {
  const tasks: Task[] = [];
  const today = new Date();

  for (let i = 1; i <= count; i++) {
    const status = STATUSES[Math.floor(Math.random() * STATUSES.length)];
    const priority = PRIORITIES[Math.floor(Math.random() * PRIORITIES.length)];
    const assignee = USERS[Math.floor(Math.random() * USERS.length)];
    
    // Randomize dates
    const startOffset = Math.floor(Math.random() * 60) - 30; // -30 to +30 days
    const dueOffset = startOffset + Math.floor(Math.random() * 14) + 1; // 1-15 days after start
    
    const startDate = Math.random() > 0.1 ? format(addDays(today, startOffset), 'yyyy-MM-dd') : undefined;
    const dueDate = format(addDays(today, dueOffset), 'yyyy-MM-dd');

    tasks.push({
      id: `task-${i}`,
      title: `Task ${i}: ${getRandomVerb()} ${getRandomNoun()}`,
      description: `Detailed description for task ${i}.`,
      status,
      priority,
      assignee,
      startDate,
      dueDate,
    });
  }

  return tasks;
};

const getRandomVerb = () => {
  const verbs = ['Implement', 'Design', 'Refactor', 'Debug', 'Test', 'Deploy', 'Review', 'Document'];
  return verbs[Math.floor(Math.random() * verbs.length)];
};

const getRandomNoun = () => {
  const nouns = ['Authentication', 'Dashboard', 'API', 'Sidebar', 'Database', 'Cache', 'UI Components', 'Security Layer'];
  return nouns[Math.floor(Math.random() * nouns.length)];
};

export { USERS };
