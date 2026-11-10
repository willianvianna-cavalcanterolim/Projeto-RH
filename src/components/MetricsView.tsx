import React from 'react';
import { CheckCircle2, Clock, AlertTriangle, ListTodo, Calendar, TrendingUp } from 'lucide-react';
import { Task, TASK_COLUMNS, PRIORITY_CONFIG } from '../types/task';

interface MetricsViewProps {
  tasks: Task[];
  onViewTask: (task: Task) => void;
}

export const MetricsView: React.FC<MetricsViewProps> = ({ tasks, onViewTask }) => {
  const total = tasks.length;
  const doneCount = tasks.filter((t) => t.status === 'done').length;
  const inProgressCount = tasks.filter((t) => t.status === 'in_progress').length;
  const waitingCount = tasks.filter((t) => t.status === 'waiting').length;
  const todoCount = tasks.filter((t) => t.status === 'todo').length;

  const completionRate = total > 0 ? Math.round((doneCount / total) * 100) : 0;

  // Group by category
  const categoryStats = tasks.reduce((acc, t) => {
    acc[t.category] = acc[t.category] || { total: 0, done: 0 };
    acc[t.category].total += 1;
    if (t.status === 'done') acc[t.category].done += 1;
    return acc;
  }, {} as Record<string, { total: number; done: number }>);

  // High priority tasks
  const highPriorityTasks = tasks.filter((t) => t.priority === 'high');

  // Sorted by nearest due date
  const upcomingDeadlines = [...tasks]
    .filter((t) => t.due_date && t.status !== 'done')
    .sort((a, b) => a.due_date.localeCompare(b.due_date));

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total */}
        <div className="bg-white p-5 rounded-2xl border border-neutral-200/90 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total de Demandas</span>
            <ListTodo className="w-4 h-4 text-neutral-400" />
          </div>
          <div className="text-2xl font-bold text-neutral-900 font-mono tabular-nums">
            {total}
          </div>
          <div className="text-[11px] text-neutral-500 mt-1">100% mapeadas</div>
        </div>

        {/* Em Andamento */}
        <div className="bg-white p-5 rounded-2xl border border-neutral-200/90 shadow-xs">
          <div className="flex items-center justify-between text-emerald-700 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Em Andamento</span>
            <Clock className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-[#0C3B2E] font-mono tabular-nums">
            {inProgressCount}
          </div>
          <div className="text-[11px] text-neutral-500 mt-1">
            {total > 0 ? Math.round((inProgressCount / total) * 100) : 0}% em execução ativa
          </div>
        </div>

        {/* Aguardando Terceiros */}
        <div className="bg-white p-5 rounded-2xl border border-neutral-200/90 shadow-xs">
          <div className="flex items-center justify-between text-amber-700 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Aguardando Terceiros</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-amber-700 font-mono tabular-nums">
            {waitingCount}
          </div>
          <div className="text-[11px] text-neutral-500 mt-1">Dependências externas</div>
        </div>

        {/* Concluídas */}
        <div className="bg-white p-5 rounded-2xl border border-neutral-200/90 shadow-xs">
          <div className="flex items-center justify-between text-green-700 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Concluídas</span>
            <CheckCircle2 className="w-4 h-4 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-green-700 font-mono tabular-nums">
            {doneCount}
          </div>
          <div className="text-[11px] text-neutral-500 mt-1">Entregas homologadas</div>
        </div>

        {/* Progresso Geral */}
        <div className="bg-white p-5 rounded-2xl border border-neutral-200/90 shadow-xs">
          <div className="flex items-center justify-between text-[#C5A059] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Progresso Global</span>
            <TrendingUp className="w-4 h-4 text-[#C5A059]" />
          </div>
          <div className="text-2xl font-bold text-[#0C3B2E] font-mono tabular-nums">
            {completionRate}%
          </div>
          <div className="w-full bg-neutral-100 rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              className="bg-[#C5A059] h-full rounded-full transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>
      </div>

      {/* Two Columns: Category Breakdown & Upcoming Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Category Breakdown */}
        <div className="bg-white p-6 rounded-2xl border border-neutral-200/90 shadow-xs">
          <h3 className="text-sm font-bold text-neutral-900 tracking-wide mb-4">
            Distribuição por Área / Categoria de Implantação
          </h3>
          <div className="space-y-4">
            {Object.entries(categoryStats).map(([cat, stats]) => {
              const pct = Math.round((stats.done / stats.total) * 100);
              return (
                <div key={cat} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-neutral-800 truncate max-w-[280px]">
                      {cat}
                    </span>
                    <span className="font-mono tabular-nums text-neutral-500">
                      {stats.done}/{stats.total} concluída(s)
                    </span>
                  </div>
                  <div className="w-full bg-neutral-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-[#0C3B2E] h-full rounded-full transition-all"
                      style={{ width: `${(stats.total / total) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Next Deadlines */}
        <div className="bg-white p-6 rounded-2xl border border-neutral-200/90 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-neutral-900 tracking-wide">
              Cronograma & Próximos Prazos
            </h3>
            <span className="text-xs text-neutral-400 font-mono">
              {upcomingDeadlines.length} pendentes
            </span>
          </div>

          <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1">
            {upcomingDeadlines.map((task) => {
              const priorityInfo = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;
              return (
                <div
                  key={task.id}
                  onClick={() => onViewTask(task)}
                  className="p-3 bg-[#F8FAF9] hover:bg-[#F0F5F2] rounded-xl border border-neutral-200/80 cursor-pointer transition-colors flex items-center justify-between gap-3"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${priorityInfo.indicatorClass}`} />
                      <span className="text-[11px] font-semibold text-[#0C3B2E] truncate">
                        {task.category}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-neutral-900 truncate">
                      {task.title}
                    </div>
                    <div className="text-[11px] text-neutral-500 truncate">
                      Responsável: {task.assignee}
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    <div className="flex items-center gap-1 font-mono text-xs font-semibold text-[#0C3B2E] tabular-nums">
                      <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span>{formatDate(task.due_date)}</span>
                    </div>
                    <span className="text-[10px] uppercase font-bold text-amber-700 tracking-wider">
                      {task.status === 'waiting' ? 'Aguardando' : 'Em Execução'}
                    </span>
                  </div>
                </div>
              );
            })}

            {upcomingDeadlines.length === 0 && (
              <div className="py-12 text-center text-xs text-neutral-400">
                Todas as tarefas com prazos definidos foram concluídas!
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
