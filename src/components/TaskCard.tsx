import React from 'react';
import { Calendar, User, ChevronRight, ChevronLeft, Edit2, Trash2, AlertCircle } from 'lucide-react';
import { Task, PRIORITY_CONFIG } from '../types/task';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onViewDetails: (task: Task) => void;
  onMoveColumn: (taskId: string, direction: 'prev' | 'next') => void;
  isFirstColumn: boolean;
  isLastColumn: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEdit,
  onDelete,
  onViewDetails,
  onMoveColumn,
  isFirstColumn,
  isLastColumn,
}) => {
  const priorityInfo = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;

  // Format date to Brazilian locale DD/MM/YYYY
  const formatBrazilianDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
      }
      const d = new Date(dateStr);
      return d.toLocaleDateString('pt-BR');
    } catch {
      return dateStr;
    }
  };

  // Check if description has an "Aguardando" section
  const hasAguardando = task.description.toLowerCase().includes('aguardando') || task.status === 'waiting';

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', task.id);
    e.dataTransfer.effectAllowed = 'move';
    // Add visual class to dragged item
    const el = e.currentTarget as HTMLElement;
    el.style.opacity = '0.5';
  };

  const handleDragEnd = (e: React.DragEvent) => {
    const el = e.currentTarget as HTMLElement;
    el.style.opacity = '1';
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className="group relative bg-white rounded-xl border border-neutral-200/90 hover:border-[#C5A059] shadow-xs hover:shadow-md transition-all duration-200 cursor-grab active:cursor-grabbing p-4 mb-3"
      onClick={() => onViewDetails(task)}
    >
      {/* Top Metadata Row: Zero-pill clean text & priority */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-[11px] font-semibold tracking-wide text-[#0C3B2E] uppercase truncate max-w-[200px]" title={task.category}>
          {task.category}
        </span>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className={`w-2 h-2 rounded-full ${priorityInfo.indicatorClass}`} />
          <span className="text-[11px] font-medium text-neutral-500">
            {priorityInfo.label}
          </span>
        </div>
      </div>

      {/* Task Title */}
      <h3 className="text-sm font-semibold text-neutral-900 group-hover:text-[#0C3B2E] transition-colors leading-snug mb-2 line-clamp-2">
        {task.title}
      </h3>

      {/* Description Snippet */}
      {task.description && (
        <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed mb-3">
          {task.description}
        </p>
      )}

      {/* Pending / Blocker notice if present */}
      {hasAguardando && task.status !== 'done' && (
        <div className="mb-3 px-2.5 py-1.5 bg-amber-50/90 border border-amber-200/80 rounded-lg flex items-start gap-1.5 text-xs text-amber-900">
          <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
          <span className="text-[11px] font-medium line-clamp-2">
            Possui pendência ou dependência de terceiros registrada.
          </span>
        </div>
      )}

      {/* Bottom Metadata & Info Bar */}
      <div className="flex items-center justify-between pt-2 border-t border-neutral-100 text-xs text-neutral-500 gap-2">
        {/* Assignee */}
        <div className="flex items-center gap-1.5 truncate max-w-[140px]" title={task.assignee}>
          <div className="w-5 h-5 rounded-full bg-[#0C3B2E] text-[#DFBF7A] flex items-center justify-center text-[10px] font-bold shrink-0">
            {task.assignee ? task.assignee.charAt(0).toUpperCase() : 'RH'}
          </div>
          <span className="truncate text-[11px] font-medium text-neutral-700">
            {task.assignee}
          </span>
        </div>

        {/* Due Date */}
        {task.due_date && (
          <div className="flex items-center gap-1 font-mono text-[11px] tabular-nums text-neutral-600 shrink-0" title={`Prazo: ${formatBrazilianDate(task.due_date)}`}>
            <Calendar className="w-3 h-3 text-[#C5A059]" />
            <span>{formatBrazilianDate(task.due_date)}</span>
          </div>
        )}
      </div>

      {/* Quick Action Overlay on hover & accessible controls */}
      <div
        className="mt-2.5 pt-2 border-t border-neutral-100 flex items-center justify-between gap-1 opacity-90 group-hover:opacity-100 transition-opacity"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Quick Move Left */}
        <div className="flex items-center gap-1">
          {!isFirstColumn && (
            <button
              onClick={() => onMoveColumn(task.id, 'prev')}
              title="Mover para coluna anterior"
              className="p-1 text-neutral-400 hover:text-[#0C3B2E] hover:bg-emerald-50 rounded transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
          {!isLastColumn && (
            <button
              onClick={() => onMoveColumn(task.id, 'next')}
              title="Mover para próxima coluna"
              className="p-1 text-neutral-400 hover:text-[#0C3B2E] hover:bg-emerald-50 rounded transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Edit and Delete Buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(task)}
            title="Editar Tarefa"
            className="p-1 text-neutral-400 hover:text-[#C5A059] hover:bg-amber-50 rounded transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            title="Excluir Tarefa"
            className="p-1 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
