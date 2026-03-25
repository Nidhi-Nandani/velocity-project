import { useEffect } from 'react';
import { useTaskStore } from '../store/useTaskStore';
import type { Presence } from '../types';

export const useCollaboration = () => {
  const { tasks, activeUsers, updatePresence } = useTaskStore();

  useEffect(() => {
    const interval = setInterval(() => {
      const presences: Presence[] = activeUsers.map(user => {
        const randomTask = tasks[Math.floor(Math.random() * tasks.length)];
        return {
          userId: user.id,
          taskId: randomTask.id,
        };
      });
      
      updatePresence(presences);
    }, 5000);

    return () => clearInterval(interval);
  }, [tasks, activeUsers, updatePresence]);
};
