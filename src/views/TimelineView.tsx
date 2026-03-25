import React from 'react';
import { useTaskStore } from '../store/useTaskStore';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, startOfDay } from 'date-fns';
import { LayoutGrid } from 'lucide-react';

export const TimelineView: React.FC = () => {
  const tasks = useTaskStore(state => state.tasks);
  const filters = useTaskStore(state => state.filters);
  const today = startOfDay(new Date());
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const filteredTasks = tasks.filter(task => {
    if (filters.status.length && !filters.status.includes(task.status)) return false;
    if (filters.priority.length && !filters.priority.includes(task.priority)) return false;
    if (filters.assignees.length && !filters.assignees.includes(task.assignee.id)) return false;
    return true;
  });


  const dayWidth = 100;

  return (
    <div className="flex h-full flex-col glass rounded-[2.5rem] border-white/5 overflow-hidden animate-scale-in">
      <div className="flex-1 overflow-auto scrollbar-hide">
        <div className="relative" style={{ width: `${days.length * dayWidth}px`, minHeight: '100%' }}>
          <div className="sticky top-0 z-30 flex border-b border-white/5 bg-slate-900/60 backdrop-blur-md">
            {days.map(day => (
              <div 
                key={day.toISOString()} 
                className={`flex flex-col items-center justify-center border-r border-white/5 py-4 text-[10px] uppercase font-black tracking-widest transition-colors ${
                  isSameDay(day, today) 
                  ? 'bg-indigo-600/20 text-indigo-400' 
                  : 'text-slate-500 hover:text-slate-300'
                }`}
                style={{ width: `${dayWidth}px` }}
              >
                <span className="opacity-50 mb-1">{format(day, 'EEE')}</span>
                <span className="text-xs">{format(day, 'd')}</span>
              </div>
            ))}
          </div>

          {/* Current Day Indicator Line */}
          <div 
            className="absolute top-0 bottom-0 z-20 w-[2px] bg-indigo-500/40 pointer-events-none"
            style={{ 
              left: `${days.findIndex(d => isSameDay(d, today)) * dayWidth + dayWidth / 2}px`,
              boxShadow: '0 0 15px rgba(99, 102, 241, 0.5)'
            }}
          />

          <div className="flex flex-col gap-3 p-4 pt-16 relative z-10">
            {filteredTasks.slice(0, 50).map((task, idx) => {
              const start = task.startDate ? startOfDay(new Date(task.startDate)) : startOfDay(new Date(task.dueDate));
              const due = startOfDay(new Date(task.dueDate));
              
              const startIdx = days.findIndex(d => isSameDay(d, start));
              const dueIdx = days.findIndex(d => isSameDay(d, due));

              if (startIdx === -1 && dueIdx === -1) return null;

              const actualStartIdx = startIdx === -1 ? 0 : startIdx;
              const actualDueIdx = dueIdx === -1 ? days.length - 1 : dueIdx;
              
              const left = actualStartIdx * dayWidth;
              const width = (actualDueIdx - actualStartIdx + 1) * dayWidth;

              const priorityColor = task.priority === 'Critical' ? 'bg-rose-500 shadow-rose-500/30' : 
                                   task.priority === 'High' ? 'bg-amber-500 shadow-amber-500/30' :
                                   task.priority === 'Medium' ? 'bg-indigo-500 shadow-indigo-500/30' :
                                   'bg-emerald-500 shadow-emerald-500/30';

              return (
                <div 
                  key={task.id}
                  className={`relative h-10 rounded-2xl shadow-xl flex items-center px-4 group transition-all duration-300 hover:scale-[1.02] hover:z-20 animate-fade-in ${priorityColor}`}
                  style={{ 
                    left: `${left + 6}px`, 
                    width: `${Math.max(40, width - 12)}px`,
                    animationDelay: `${0.4 + idx * 0.05}s`
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent rounded-2xl" />
                  <span className="truncate text-[10px] font-black uppercase tracking-wider text-white relative z-10 drop-shadow-md">
                    {task.title}
                  </span>
                  
                  {/* Tooltip on hover */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 glass rounded-xl text-[9px] font-black text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                     {task.priority} // {task.status}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Grid lines */}
          <div className="absolute inset-0 pointer-events-none flex opacity-[0.03]">
             {days.map(day => (
                <div key={`grid-${day.toISOString()}`} className="h-full border-r border-white" style={{ width: `${dayWidth}px` }} />
             ))}
          </div>
        </div>
      </div>
      
      {filteredTasks.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-slate-950/40 backdrop-blur-sm">
             <div className="h-16 w-16 rounded-full bg-slate-900 border border-white/5 flex items-center justify-center animate-pulse">
                <LayoutGrid className="text-slate-700" size={24} />
             </div>
             <p className="text-[11px] font-black text-slate-600 uppercase tracking-[0.4em]">Timeline Void</p>
          </div>
      )}
    </div>
  );
};
