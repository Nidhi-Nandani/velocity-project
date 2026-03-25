import React, { useState } from 'react';
import { KanbanView } from './views/KanbanView';
import { ListView } from './views/ListView';
import { TimelineView } from './views/TimelineView';
import { FilterBar } from './components/FilterBar';
import { useUrlFilters } from './hooks/useUrlFilters';
import { useCollaboration } from './hooks/useCollaboration';
import { useTaskStore } from './store/useTaskStore';
import { Avatar } from './components/Avatar';
import { LayoutGrid, List, Calendar } from 'lucide-react';

type ViewType = 'kanban' | 'list' | 'timeline';

const App: React.FC = () => {
  useUrlFilters();
  useCollaboration();
  const [activeView, setActiveView] = useState<ViewType>('kanban');
  const activeUsers = useTaskStore(state => state.activeUsers);

  return (
    <div className="flex min-h-screen h-screen w-full flex-col bg-slate-950 px-4 py-4 md:px-8 md:py-6 overflow-hidden font-sans text-slate-50 relative selection:bg-indigo-500/30">
      <header className="flex flex-col md:flex-row md:items-center justify-between py-4 mb-4 z-50 animate-fade-in gap-6 md:gap-0">
        <div className="flex items-center gap-4 md:gap-6 group cursor-default">
          <div className="h-10 w-10 md:h-14 md:w-14 rounded-2xl md:rounded-3xl bg-indigo-600 flex items-center justify-center shadow-2xl shadow-indigo-500/40 rotate-3 transition-transform group-hover:rotate-6 duration-500 relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent" />
             <LayoutGrid className="text-white relative z-10 w-5 h-5 md:w-7 md:h-7" />
          </div>
          <div>
            <h1 className="text-xl md:text-3xl font-black tracking-[0.1em] md:tracking-[0.15em] text-white leading-none mb-1 uppercase bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-indigo-400">VELOZITY</h1>
            <div className="flex items-center gap-2 md:gap-3">
              <p className="text-[8px] md:text-[10px] font-black text-indigo-400/80 uppercase tracking-[0.2em] md:tracking-[0.3em]">Project Intelligence v1.0</p>
              <div className="h-px w-4 md:w-8 bg-indigo-500/30" />
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-10">
          <div className="hidden sm:flex items-center gap-4 glass px-4 py-2 md:px-6 md:py-3 rounded-2xl md:rounded-3xl border-white/5 shadow-2xl transition-all hover:bg-white/10 hover:scale-[1.02] duration-300">
             <div className="flex -space-x-3 md:-space-x-4">
                {activeUsers.slice(0, 3).map(user => (
                   <Avatar key={user.id} initials={user.initials} color={user.color} size="lg" className="ring-4 ring-slate-950 transition-transform hover:-translate-y-1 hover:z-10" />
                ))}
                {activeUsers.length > 3 && (
                  <div className="h-10 w-10 rounded-full bg-slate-800 ring-4 ring-slate-950 flex items-center justify-center text-[10px] font-bold text-slate-400">
                    +{activeUsers.length - 3}
                  </div>
                )}
             </div>
             <div className="flex flex-col">
                <span className="text-xs font-black text-white leading-none tracking-tight">{activeUsers.length} online</span>
                <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest mt-1">Live Team</span>
             </div>
          </div>

          <div className="flex rounded-[2.5rem] glass p-1.5 border-white/5 shadow-2xl">
             <button
               onClick={() => setActiveView('kanban')}
               className={`flex items-center gap-2 rounded-[2rem] px-6 py-3 text-[11px] font-black transition-all duration-300 ${
                 activeView === 'kanban' 
                 ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/30 scale-100' 
                 : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
               }`}
             >
               <LayoutGrid size={14} strokeWidth={3} /> KANBAN
             </button>
             <button
               onClick={() => setActiveView('list')}
               className={`flex items-center gap-2 rounded-[2rem] px-6 py-3 text-[11px] font-black transition-all duration-300 ${
                 activeView === 'list' 
                 ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/30 scale-100' 
                 : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
               }`}
             >
               <List size={14} strokeWidth={3} /> LIST
             </button>
             <button
               onClick={() => setActiveView('timeline')}
               className={`flex items-center gap-2 rounded-[2rem] px-6 py-3 text-[11px] font-black transition-all duration-300 ${
                 activeView === 'timeline' 
                 ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/30 scale-100' 
                 : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
               }`}
             >
               <Calendar size={14} strokeWidth={3} /> TIMELINE
             </button>
          </div>
        </div>
      </header>

      <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <FilterBar />
      </div>

      <main className="flex-1 overflow-hidden mt-2 animate-slide-up" style={{ animationDelay: '0.2s' }}>
        {activeView === 'kanban' && <KanbanView />}
        {activeView === 'list' && <ListView />}
        {activeView === 'timeline' && <TimelineView />}
      </main>
    </div>
  );
};

export default App;
