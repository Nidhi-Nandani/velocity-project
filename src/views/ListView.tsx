import React, { useState, useMemo } from 'react';
import { useTaskStore } from '../store/useTaskStore';
import { VirtualList } from '../components/VirtualList';
import type { Task, Status } from '../types';
import { Avatar } from '../components/Avatar';
import { Badge } from '../components/Badge';
import { format } from 'date-fns';
import { List } from 'lucide-react';

type SortConfig = { key: keyof Task | 'assignee'; direction: 'asc' | 'desc' } | null;

export const ListView: React.FC = () => {
  const tasks = useTaskStore(state => state.tasks);
  const filters = useTaskStore(state => state.filters);
  const updateTask = useTaskStore(state => state.updateTask);
  const [sortConfig, setSortConfig] = useState<SortConfig>(null);

  const filteredTasks = useMemo(() => {
    const result = tasks.filter(task => {
      if (filters.status.length && !filters.status.includes(task.status)) return false;
      if (filters.priority.length && !filters.priority.includes(task.priority)) return false;
      if (filters.assignees.length && !filters.assignees.includes(task.assignee.id)) return false;
      return true;
    });

    if (sortConfig) {
      result.sort((a, b) => {
        let aValue: string;
        let bValue: string;

        if (sortConfig.key === 'assignee') {
          aValue = a.assignee.name;
          bValue = b.assignee.name;
        } else {
          aValue = a[sortConfig.key as keyof Task] as string;
          bValue = b[sortConfig.key as keyof Task] as string;
        }

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [tasks, filters, sortConfig]);

  const toggleSort = (key: keyof Task | 'assignee') => {
    setSortConfig(prev => {
      if (prev?.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

  const renderTaskRow = (task: Task) => (
    <div className="flex items-center gap-4 border-b border-white/5 bg-slate-900/20 px-4 md:px-6 py-4 hover:bg-white/5 transition-all duration-300 group min-w-[800px] md:min-w-0">
      <div className="flex-1 min-w-[200px] truncate font-black text-[10px] md:text-[11px] uppercase tracking-wider text-slate-200 group-hover:text-indigo-300 transition-colors">{task.title}</div>
      <div className="w-32 md:w-40">
        <select 
          value={task.status}
          onChange={(e) => updateTask(task.id, { status: e.target.value as Status })}
          className="rounded-xl border border-white/10 bg-slate-800/50 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400 outline-none cursor-pointer hover:border-indigo-500/50 transition-colors appearance-none"
        >
          {['To Do', 'In Progress', 'In Review', 'Done'].map(s => (
            <option key={s} value={s} className="bg-slate-900 text-slate-100">{s}</option>
          ))}
        </select>
      </div>
      <div className="w-24">
        <Badge variant={task.priority === 'Critical' ? 'destructive' : task.priority === 'High' ? 'warning' : 'info'} className="scale-90 origin-left uppercase font-black text-[9px] tracking-widest">
          {task.priority}
        </Badge>
      </div>
      <div className="w-32 flex items-center gap-3">
        <Avatar initials={task.assignee.initials} color={task.assignee.color} size="sm" className="ring-2 ring-slate-950" />
        <span className="text-[10px] font-black uppercase tracking-tighter text-slate-500">{task.assignee.name}</span>
      </div>
      <div className="w-32 text-[10px] font-black uppercase tracking-widest text-slate-600">
        {format(new Date(task.dueDate), 'MMM d, yyyy')}
      </div>
    </div>
  );

  return (
    <div className="flex h-full flex-col glass rounded-[2.5rem] border-white/5 overflow-auto md:overflow-hidden animate-scale-in">
    <div className="flex items-center gap-4 bg-white/[0.02] border-b border-white/5 px-4 md:px-6 py-5 text-[9px] font-black uppercase tracking-[0.3em] text-indigo-400/70 min-w-[800px] md:min-w-0">
      <button onClick={() => toggleSort('title')} className="flex-1 min-w-[200px] text-left hover:text-white transition-colors">
        Protocol Identifier {sortConfig?.key === 'title' && (sortConfig.direction === 'asc' ? ' ↑' : ' ↓')}
      </button>
      <div className="w-32 md:w-40">Status Code</div>
        <button onClick={() => toggleSort('priority')} className="w-24 text-left hover:text-white transition-colors">
          Priority {sortConfig?.key === 'priority' && (sortConfig.direction === 'asc' ? ' ↑' : ' ↓')}
        </button>
        <button onClick={() => toggleSort('assignee')} className="w-32 text-left hover:text-white transition-colors">
          Assigned Agent {sortConfig?.key === 'assignee' && (sortConfig.direction === 'asc' ? ' ↑' : ' ↓')}
        </button>
        <button onClick={() => toggleSort('dueDate')} className="w-32 text-left hover:text-white transition-colors">
          Deadline {sortConfig?.key === 'dueDate' && (sortConfig.direction === 'asc' ? ' ↑' : ' ↓')}
        </button>
      </div>
      <div className="flex-1 overflow-hidden bg-slate-950/20">
        <VirtualList 
          items={filteredTasks}
          itemHeight={64}
          renderItem={(task) => renderTaskRow(task)}
        />
        {filteredTasks.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-4">
             <div className="h-16 w-16 rounded-full bg-slate-900 border border-white/5 flex items-center justify-center animate-pulse">
                <List className="text-slate-700" size={24} />
             </div>
             <p className="text-[11px] font-black text-slate-600 uppercase tracking-[0.4em]">Grid Empty</p>
          </div>
        )}
      </div>
    </div>
  );
};
