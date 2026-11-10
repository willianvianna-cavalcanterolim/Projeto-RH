import React from 'react';
import { X, Calendar, User, Clock, Edit2, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Task, TASK_COLUMNS, PRIORITY_CONFIG, TaskStatus } from '../types/task';

interface TaskDetailModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, newStatus: TaskStatus) => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  task,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  if (!isOpen || !task) return null;

  const currentColumn = TASK_COLUMNS.find((c) => c.id === task.status);
  const priorityInfo = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'Não definido';
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
      }
      return new Date(dateStr).toLocaleDateString('pt-BR');
    } catch {
      return dateStr;
    }
  };

  const formatTimestamp = (isoStr: string) => {
    if (!isoStr) return '-';
    try {
      const date = new Date(isoStr);
      return date.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoStr;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-neutral-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Accent Bar */}
        <div className="bg-[#0C3B2E] px-6 py-5 text-white border-b border-[#C5A059]/40 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5 text-xs text-[#DFBF7A] font-semibold tracking-wide">
              <span>{task.category}</span>
              <span>·</span>
              <span>Prioridade {priorityInfo.label}</span>
            </div>
            <h2 className="text-xl font-bold leading-snug">
              {task.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-emerald-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Status Quick Switcher */}
          <div className="bg-[#F8FAF9] p-3 rounded-xl border border-neutral-200">
            <span className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
              Status da Demanda
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {TASK_COLUMNS.map((col) => {
                const isSelected = task.status === col.id;
                return (
                  <button
                    key={col.id}
                    onClick={() => onStatusChange(task.id, col.id)}
                    className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-all text-center flex items-center justify-center gap-1.5 ${
                      isSelected
                        ? 'bg-[#0C3B2E] text-white border-[#0C3B2E] shadow-xs'
                        : 'bg-white text-neutral-700 border-neutral-200 hover:border-[#C5A059] hover:bg-neutral-50'
                    }`}
                  >
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: col.color }}
                    />
                    <span className="truncate">{col.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Key Info Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-neutral-50 border border-neutral-200/80">
            <div>
              <span className="block text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-1">
                Responsável
              </span>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#0C3B2E] text-[#DFBF7A] flex items-center justify-center text-xs font-bold">
                  {task.assignee ? task.assignee.charAt(0).toUpperCase() : 'R'}
                </div>
                <span className="text-xs font-medium text-neutral-800">
                  {task.assignee || 'Equipe Geral'}
                </span>
              </div>
            </div>

            <div>
              <span className="block text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-1">
                Prazo Previsto
              </span>
              <div className="flex items-center gap-1.5 text-xs font-medium text-neutral-800 font-mono tabular-nums">
                <Calendar className="w-4 h-4 text-[#C5A059]" />
                <span>{formatDate(task.due_date)}</span>
              </div>
            </div>

            <div>
              <span className="block text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-1">
                Última Atualização
              </span>
              <div className="flex items-center gap-1.5 text-xs text-neutral-600 font-mono tabular-nums">
                <Clock className="w-3.5 h-3.5 text-neutral-400" />
                <span>{formatTimestamp(task.updated_at)}</span>
              </div>
            </div>
          </div>

          {/* Full Description & Scope */}
          <div>
            <h4 className="text-xs font-semibold text-neutral-900 uppercase tracking-wider mb-2">
              Detalhamento da Pauta & Observações
            </h4>
            <div className="p-4 bg-white rounded-xl border border-neutral-200 text-sm text-neutral-700 whitespace-pre-wrap leading-relaxed">
              {task.description || 'Nenhuma descrição detalhada informada.'}
            </div>
          </div>

        </div>

        {/* Modal Actions */}
        <div className="px-6 py-4 bg-[#F8FAF9] border-t border-neutral-200 flex items-center justify-between">
          <button
            onClick={() => {
              onDelete(task.id);
              onClose();
            }}
            className="flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3 py-2 rounded-lg transition-colors font-medium border border-transparent hover:border-rose-200"
          >
            <Trash2 className="w-4 h-4" />
            <span>Excluir Demanda</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onEdit(task);
              }}
              className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 bg-[#0C3B2E] text-white hover:bg-[#165643] rounded-lg transition-colors shadow-xs"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Editar Demanda</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-100 transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
