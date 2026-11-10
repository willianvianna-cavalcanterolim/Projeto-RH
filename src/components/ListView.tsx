import React from 'react';
import { Calendar, Edit2, Trash2, ExternalLink } from 'lucide-react';
import { Task, TASK_COLUMNS, PRIORITY_CONFIG, TaskStatus } from '../types/task';

interface ListViewProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onViewTask: (task: Task) => void;
  onStatusChange: (id: string, newStatus: TaskStatus) => void;
}

export const ListView: React.FC<ListViewProps> = ({
  tasks,
  onEditTask,
  onDeleteTask,
  onViewTask,
  onStatusChange,
}) => {
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-white rounded-2xl border border-neutral-200/90 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-200/80 bg-[#F9FBFA] flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-neutral-900 tracking-wide">
              Matriz Estruturada de Demandas de RH / DP
            </h2>
            <p className="text-xs text-neutral-500">
              Visualização analítica de todas as tarefas cadastradas
            </p>
          </div>
          <span className="text-xs font-mono font-medium text-neutral-600 tabular-nums">
            Total: {tasks.length} registros
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-700">
            <thead className="bg-neutral-100/75 border-b border-neutral-200 text-neutral-600 uppercase font-semibold text-[11px] tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Título & Categoria</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5">Prioridade</th>
                <th className="px-4 py-3.5">Responsável</th>
                <th className="px-4 py-3.5">Prazo</th>
                <th className="px-5 py-3.5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {tasks.map((task) => {
                const priorityInfo = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;
                const column = TASK_COLUMNS.find((c) => c.id === task.status);

                return (
                  <tr
                    key={task.id}
                    className="hover:bg-neutral-50/80 transition-colors group cursor-pointer"
                    onClick={() => onViewTask(task)}
                  >
                    {/* Title & Category */}
                    <td className="px-5 py-4 max-w-sm">
                      <div className="font-semibold text-neutral-900 group-hover:text-[#0C3B2E] transition-colors leading-snug">
                        {task.title}
                      </div>
                      <div className="text-[11px] text-[#0C3B2E] font-medium tracking-wide mt-0.5 truncate">
                        {task.category}
                      </div>
                      {task.description && (
                        <div className="text-[11px] text-neutral-500 line-clamp-1 mt-1">
                          {task.description}
                        </div>
                      )}
                    </td>

                    {/* Status Select */}
                    <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={task.status}
                        onChange={(e) => onStatusChange(task.id, e.target.value as TaskStatus)}
                        className="text-xs font-medium bg-[#F9FBFA] border border-neutral-200 rounded-md px-2 py-1 text-neutral-800 focus:outline-hidden focus:border-[#0C3B2E]"
                      >
                        {TASK_COLUMNS.map((col) => (
                          <option key={col.id} value={col.id}>
                            {col.title}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Priority */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${priorityInfo.indicatorClass}`} />
                        <span className="font-medium text-neutral-700">{priorityInfo.label}</span>
                      </div>
                    </td>

                    {/* Assignee */}
                    <td className="px-4 py-4 font-medium text-neutral-800">
                      {task.assignee || 'A definir'}
                    </td>

                    {/* Due Date */}
                    <td className="px-4 py-4 font-mono tabular-nums text-neutral-600">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
                        <span>{formatDate(task.due_date)}</span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onViewTask(task)}
                          className="p-1.5 text-neutral-400 hover:text-[#0C3B2E] hover:bg-emerald-50 rounded-lg transition-colors"
                          title="Ver detalhes completos"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onEditTask(task)}
                          className="p-1.5 text-neutral-400 hover:text-[#C5A059] hover:bg-amber-50 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteTask(task.id)}
                          className="p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Excluir"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {tasks.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-neutral-400">
                    Nenhuma tarefa encontrada com os filtros selecionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
