import { useState, useEffect, useCallback } from 'react';
import type { Status } from '../types';
import { useTaskStore } from '../store/useTaskStore';

interface DragState {
  taskId: string;
  initialX: number;
  initialY: number;
  currentX: number;
  currentY: number;
  width: number;
  height: number;
  originalStatus: Status;
}

export const usePointerDnD = () => {
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [activeColumn, setActiveColumn] = useState<Status | null>(null);
  const moveTask = useTaskStore((state) => state.moveTask);

  const onPointerDown = (e: React.PointerEvent, taskId: string, status: Status) => {
    if (e.button !== 0) return;
    
    const element = e.currentTarget as HTMLElement;
    const rect = element.getBoundingClientRect();
    
    setDragState({
      taskId,
      initialX: e.clientX - rect.left,
      initialY: e.clientY - rect.top,
      currentX: e.clientX,
      currentY: e.clientY,
      width: rect.width,
      height: rect.height,
      originalStatus: status,
    });
    
    element.setPointerCapture(e.pointerId);
  };

  const onPointerMove = useCallback((e: PointerEvent) => {
    if (!dragState) return;
    
    setDragState(prev => prev ? {
      ...prev,
      currentX: e.clientX,
      currentY: e.clientY,
    } : null);

    const elements = document.elementsFromPoint(e.clientX, e.clientY);
    const columnElement = elements.find(el => el.hasAttribute('data-column-status'));
    const status = columnElement?.getAttribute('data-column-status') as Status | null;
    
    setActiveColumn(status);
  }, [dragState]);

  const onPointerUp = useCallback(() => {
    if (!dragState) return;

    if (activeColumn && activeColumn !== dragState.originalStatus) {
      moveTask(dragState.taskId, activeColumn);
    }
    
    setDragState(null);
    setActiveColumn(null);
  }, [dragState, activeColumn, moveTask]);

  useEffect(() => {
    if (dragState) {
      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerup', onPointerUp);
      return () => {
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerup', onPointerUp);
      };
    }
  }, [dragState, onPointerMove, onPointerUp]);

  return {
    dragState,
    activeColumn,
    onPointerDown,
  };
};
