import { useEffect } from 'react';
import { useTaskStore } from '../store/useTaskStore';
import type { Status, Priority } from '../types';

export const useUrlFilters = () => {
  const { filters, setFilters } = useTaskStore();

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.status.length) params.set('status', filters.status.join(','));
    if (filters.priority.length) params.set('priority', filters.priority.join(','));
    if (filters.assignees.length) params.set('assignees', filters.assignees.join(','));
    if (filters.dueDateRange.from) params.set('from', filters.dueDateRange.from);
    if (filters.dueDateRange.to) params.set('to', filters.dueDateRange.to);

    const currentParams = new URLSearchParams(window.location.search);
    if (params.toString() !== currentParams.toString()) {
      const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
      window.history.replaceState(null, '', newUrl);
    }
  }, [filters]);

  useEffect(() => {
    const syncFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      setFilters({
        status: (params.get('status')?.split(',').filter(Boolean) as Status[]) || [],
        priority: (params.get('priority')?.split(',').filter(Boolean) as Priority[]) || [],
        assignees: params.get('assignees')?.split(',').filter(Boolean) || [],
        dueDateRange: {
          from: params.get('from') || null,
          to: params.get('to') || null,
        },
      });
    };

    syncFromUrl();
    window.addEventListener('popstate', syncFromUrl);
    return () => window.removeEventListener('popstate', syncFromUrl);
  }, [setFilters]);
};
