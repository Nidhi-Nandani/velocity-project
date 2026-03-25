import React from 'react';
import { useTaskStore } from '../store/useTaskStore';
import type { Status, Priority } from '../types';
import { USERS } from '../utils/mockData';

export const FilterBar: React.FC = () => {
  const { filters, setFilters, clearFilters } = useTaskStore();
  
  const hasActiveFilters = filters.status.length > 0 || 
                          filters.priority.length > 0 || 
                          filters.assignees.length > 0 || 
                          filters.dueDateRange.from !== null || 
                          filters.dueDateRange.to !== null;

  const toggleFilter = <T,>(list: T[], value: T) => {
    return list.includes(value) ? list.filter(v => v !== value) : [...list, value];
  };

  return (
    <div className="flex flex-wrap items-center gap-4 md:gap-8 py-4 md:py-6 mb-2">
      <div className="flex flex-col gap-2.5">
        <label className="text-[9px] font-black uppercase tracking-[0.25em] text-indigo-400/70 ml-1">Status Protocol</label>
        <div className="flex gap-2">
          {['To Do', 'In Progress', 'In Review', 'Done'].map(s => (
            <button
              key={s}
              onClick={() => setFilters({ status: toggleFilter(filters.status, s as Status) })}
              className={`rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-wider transition-all duration-300 ${
                filters.status.includes(s as Status) 
                ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/40 scale-105 z-10' 
                : 'glass text-slate-400 hover:text-slate-200 hover:bg-white/10'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        <label className="text-[9px] font-black uppercase tracking-[0.25em] text-indigo-400/70 ml-1">Priority Level</label>
        <div className="flex gap-2">
          {['Low', 'Medium', 'High', 'Critical'].map(p => (
            <button
              key={p}
              onClick={() => setFilters({ priority: toggleFilter(filters.priority, p as Priority) })}
              className={`rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-wider transition-all duration-300 ${
                filters.priority.includes(p as Priority) 
                ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/40 scale-105 z-10' 
                : 'glass text-slate-400 hover:text-slate-200 hover:bg-white/10'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        <label className="text-[9px] font-black uppercase tracking-[0.25em] text-indigo-400/70 ml-1">Assigned Agents</label>
        <div className="flex items-center -space-x-3 ml-1">
          {USERS.map(u => (
            <button
              key={u.id}
              onClick={() => setFilters({ assignees: toggleFilter(filters.assignees, u.id) })}
              title={u.name}
              className={`relative h-10 w-10 rounded-full border-2 transition-all duration-300 hover:z-30 hover:-translate-y-1 ${
                filters.assignees.includes(u.id) 
                ? 'border-indigo-500 ring-4 ring-indigo-500/30 scale-110 z-20' 
                : 'border-slate-900 grayscale-50 hover:grayscale-0'
              }`}
              style={{ backgroundColor: u.color }}
            >
              <span className="text-[10px] font-black text-white uppercase">{u.initials}</span>
              {filters.assignees.includes(u.id) && (
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-indigo-500 rounded-full border-2 border-slate-950" />
              )}
            </button>
          ))}
        </div>
      </div>

      {hasActiveFilters && (
        <button 
          onClick={clearFilters}
          className="mt-6 text-[10px] font-black text-indigo-400 hover:text-indigo-300 transition-colors uppercase tracking-[0.2em] border-b border-indigo-500/30 pb-0.5"
        >
          Reset Environment
        </button>
      )}
    </div>
  );
};
