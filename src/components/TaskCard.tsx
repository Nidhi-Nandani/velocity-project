import React, { useMemo } from 'react';
import type { Task, Status } from '../types';
import { Avatar } from './Avatar';
import { Badge } from './Badge';
import { format, isToday, isBefore, differenceInDays, startOfDay } from 'date-fns';
import { useTaskStore } from '../store/useTaskStore';

interface TaskCardProps {
  task: Task;
  onPointerDown: (e: React.PointerEvent, taskId: string, status: Status) => void;
  isDragging?: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onPointerDown, isDragging }) => {
  const allPresences = useTaskStore((state) => state.presences);
  const activeUsers = useTaskStore((state) => state.activeUsers);
  
  const presenceUsers = useMemo(() => {
    const taskPresences = allPresences.filter(p => p.taskId === task.id);
    return taskPresences.map(p => activeUsers.find(u => u.id === p.userId)).filter(Boolean);
  }, [allPresences, activeUsers, task.id]);

  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'destructive';
      case 'High': return 'warning';
      case 'Medium': return 'info';
      default: return 'success';
    }
  };

  const getDueDateLabel = (dateStr: string) => {
    const date = startOfDay(new Date(dateStr));
    const today = startOfDay(new Date());
    
    if (isToday(date)) return 'Due Today';
    if (isBefore(date, today)) {
      const days = differenceInDays(today, date);
      return days > 7 ? `${days} days overdue` : format(date, 'MMM d');
    }
    return format(date, 'MMM d');
  };

  const isOverdue = isBefore(startOfDay(new Date(task.dueDate)), startOfDay(new Date())) && !isToday(new Date(task.dueDate));

  return (
    <div
      className={`group relative flex flex-col gap-4 rounded-3xl p-5 transition-all duration-500 glass-card touch-none animate-scale-in border-white/5 active:scale-[0.98] ${
        isDragging ? 'opacity-30 scale-95 cursor-grabbing blur-sm' : 'cursor-grab bg-slate-900/40 hover:bg-slate-800/60'
      }`}
      onPointerDown={(e) => onPointerDown(e, task.id, task.status)}
    >
      <div className="flex items-start justify-between gap-4">
        <h3 className="line-clamp-2 text-sm font-black text-white/90 leading-tight uppercase tracking-wide group-hover:text-indigo-300 transition-colors">
          {task.title}
        </h3>
        <Badge variant={getPriorityVariant(task.priority)} className="shrink-0 scale-90 group-hover:scale-100 transition-transform">
          {task.priority}
        </Badge>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar 
              initials={task.assignee.initials} 
              color={task.assignee.color} 
              size="sm" 
              className="ring-2 ring-slate-950 shadow-lg"
            />
            <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-emerald-500 rounded-full border-2 border-slate-950 shadow-glow" />
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Due Date</span>
            <span className={`text-[10px] font-black uppercase tracking-tight ${isOverdue ? 'text-rose-500 animate-pulse' : 'text-slate-300'}`}>
              {getDueDateLabel(task.dueDate)}
            </span>
          </div>
        </div>

        <div className="flex -space-x-2.5">
          {presenceUsers.map((user, i) => (
            <Avatar 
              key={user!.id}
              initials={user!.initials}
              color={user!.color}
              size="xs"
              className="ring-2 ring-slate-950 transition-transform hover:-translate-y-1 hover:z-10"
              presenceCount={i === 0 ? presenceUsers.length : undefined}
            />
          ))}
        </div>
      </div>

      {/* Hover decoration */}
      <div className="absolute -inset-px rounded-3xl bg-gradient-to-tr from-indigo-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </div>
  );
};
