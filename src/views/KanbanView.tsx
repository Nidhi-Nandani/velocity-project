import React from 'react';
import type { Status } from '../types';
import { useTaskStore } from '../store/useTaskStore';
import { TaskCard } from '../components/TaskCard';
import { usePointerDnD } from '../hooks/usePointerDnD';
import { LayoutGrid } from 'lucide-react';

const COLUMNS: Status[] = ['To Do', 'In Progress', 'In Review', 'Done'];

export const KanbanView: React.FC = () => {
  const tasks = useTaskStore(state => state.tasks);
  const filters = useTaskStore(state => state.filters);
  const { dragState, activeColumn, onPointerDown } = usePointerDnD();

  const filteredTasks = tasks.filter(task => {
    if (filters.status.length && !filters.status.includes(task.status)) return false;
    if (filters.priority.length && !filters.priority.includes(task.priority)) return false;
    if (filters.assignees.length && !filters.assignees.includes(task.assignee.id)) return false;
    return true;
  });

  return (
    <div className="flex h-full gap-8 overflow-x-auto pb-4 scrollbar-hide">
      {COLUMNS.map((status, idx) => {
        const columnTasks = filteredTasks.filter(t => t.status === status);
        const isActive = activeColumn === status;

        return (
          <div
            key={status}
            data-column-status={status}
            className={`kanban-column transition-all duration-500 animate-slide-up ${
              isActive ? 'bg-indigo-500/10 border-indigo-500/30' : ''
            }`}
            style={{ animationDelay: `${0.3 + idx * 0.1}s` }}
          >
            <div className="mb-6 flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <div className={`h-2 w-2 rounded-full ${
                  status === 'Done' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' :
                  status === 'In Review' ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]' :
                  status === 'In Progress' ? 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]' :
                  'bg-slate-500 shadow-[0_0_10px_rgba(100,116,139,0.5)]'
                }`} />
                <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-white/90">
                  {status}
                </h2>
              </div>
              <span className="rounded-lg bg-white/5 border border-white/10 px-2.5 py-1 text-[10px] font-black text-indigo-300">
                {columnTasks.length}
              </span>
            </div>

            <div className="flex flex-col gap-5 overflow-y-auto pr-2 scrollbar-hide pb-10">
              {columnTasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onPointerDown={onPointerDown}
                  isDragging={dragState?.taskId === task.id}
                />
              ))}
              {columnTasks.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 px-4 rounded-3xl border border-dashed border-white/5 bg-white/[0.02]">
                   <div className="h-10 w-10 rounded-full bg-slate-900 border border-white/5 flex items-center justify-center mb-4">
                      <LayoutGrid className="text-slate-700" size={16} />
                   </div>
                   <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">Protocol Idle</p>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {dragState && (
        <div
          className="pointer-events-none fixed z-[100] transition-transform duration-75"
          style={{
            width: `${dragState.width}px`,
            left: `${dragState.currentX - dragState.initialX}px`,
            top: `${dragState.currentY - dragState.initialY}px`,
            transform: 'rotate(3deg) scale(1.05)',
          }}
        >
          <div className="glass rounded-3xl border-indigo-500/30 p-5 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] relative overflow-hidden">
             <div className="absolute inset-0 bg-indigo-500/10" />
             <div className="relative z-10">
                <h3 className="line-clamp-2 text-sm font-black text-white leading-tight uppercase tracking-wide">
                  {tasks.find(t => t.id === dragState.taskId)?.title}
                </h3>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};
