import React from 'react';
import { Plus, LayoutGrid, List, BarChart3, RotateCcw, Download } from 'lucide-react';
import { Task } from '../types/task';

interface HeaderProps {
  currentView: 'kanban' | 'list' | 'metrics';
  onViewChange: (view: 'kanban' | 'list' | 'metrics') => void;
  onNewTask: () => void;
  onResetSeed: () => void;
  tasks: Task[];
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onViewChange,
  onNewTask,
  onResetSeed,
  tasks,
}) => {
  const exportToCSV = () => {
    const headers = ['ID', 'Título', 'Categoria', 'Status', 'Prioridade', 'Responsável', 'Prazo', 'Descrição'];
    const rows = tasks.map((t) => [
      t.id,
      `"${t.title.replace(/"/g, '""')}"`,
      `"${t.category.replace(/"/g, '""')}"`,
      t.status,
      t.priority,
      `"${t.assignee.replace(/"/g, '""')}"`,
      t.due_date,
      `"${t.description.replace(/"/g, '""').replace(/\n/g, ' ')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `kanban-rh-dp-cavalcanterolim-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <header className="bg-[#0C3B2E] text-white border-b border-[#C5A059]/30 shadow-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-3.5 sm:gap-4 shrink-0">
            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#C5A059] shadow-inner bg-[#08281F] flex items-center justify-center shrink-0">
              <img
                src="/assets/aistudio/Foto_Logo_C_R_18c40d3d.png"
                alt="Cavalcante & Rolim Empreendimentos"
                className="w-full h-full object-cover scale-110"
                onError={(e) => {
                  // Fallback to stylized monogram if asset fails
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <span className="font-brand font-bold text-[#C5A059] text-base tracking-widest hidden [display:none]">CR</span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-brand text-lg sm:text-xl font-bold tracking-wider text-[#FFFFFF] drop-shadow-sm whitespace-nowrap">
                  CAVALCANTE & ROLIM
                </h1>
                <span className="hidden sm:inline-block text-[11px] font-semibold text-[#DFBF7A] bg-[#08281F]/80 px-2 py-0.5 rounded border border-[#C5A059]/40 tracking-wider">
                  SIGNATURE SPACES
                </span>
              </div>
              <p className="text-xs text-emerald-100/80 font-medium tracking-wide">
                Quadro de Implantação e Gestão de RH / Departamento Pessoal
              </p>
            </div>
          </div>

          {/* Navigation Views & Actions */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* View Selector */}
            <div className="flex items-center bg-[#08281F] p-1 rounded-lg border border-[#C5A059]/30">
              <button
                onClick={() => onViewChange('kanban')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
                  currentView === 'kanban'
                    ? 'bg-[#C5A059] text-[#0C3B2E] font-semibold shadow-sm'
                    : 'text-emerald-100 hover:text-white hover:bg-emerald-900/40'
                }`}
                title="Quadro Kanban"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Kanban</span>
              </button>

              <button
                onClick={() => onViewChange('list')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
                  currentView === 'list'
                    ? 'bg-[#C5A059] text-[#0C3B2E] font-semibold shadow-sm'
                    : 'text-emerald-100 hover:text-white hover:bg-emerald-900/40'
                }`}
                title="Lista Estruturada de Pautas"
              >
                <List className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Lista</span>
              </button>

              <button
                onClick={() => onViewChange('metrics')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
                  currentView === 'metrics'
                    ? 'bg-[#C5A059] text-[#0C3B2E] font-semibold shadow-sm'
                    : 'text-emerald-100 hover:text-white hover:bg-emerald-900/40'
                }`}
                title="Visão Geral & Indicadores"
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Indicadores</span>
              </button>
            </div>

            {/* Utility Actions */}
            <div className="hidden lg:flex items-center gap-1.5">
              <button
                onClick={exportToCSV}
                className="p-2 text-emerald-200 hover:text-white hover:bg-[#08281F] rounded-lg transition-colors border border-transparent hover:border-[#C5A059]/30"
                title="Exportar dados para planilha Excel / CSV"
              >
                <Download className="w-4 h-4" />
              </button>
              
              <button
                onClick={onResetSeed}
                className="p-2 text-emerald-200 hover:text-white hover:bg-[#08281F] rounded-lg transition-colors border border-transparent hover:border-[#C5A059]/30"
                title="Restaurar pautas originais da reunião de RH"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Primary Action Button */}
            <button
              onClick={onNewTask}
              className="flex items-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2 bg-gradient-to-r from-[#DFBF7A] via-[#C5A059] to-[#A68339] text-[#0C3B2E] text-xs sm:text-sm font-semibold rounded-lg shadow-sm hover:brightness-110 active:scale-[0.98] transition-all whitespace-nowrap shrink-0 border border-[#E0C17E]"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Nova Tarefa</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
