import React from 'react';
import { Search, Filter, X, SlidersHorizontal } from 'lucide-react';
import { TaskPriority } from '../types/task';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedPriority: string;
  onPriorityChange: (priority: string) => void;
  categories: string[];
  totalTasks: number;
  filteredCount: number;
  onClearFilters: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedPriority,
  onPriorityChange,
  categories,
  totalTasks,
  filteredCount,
  onClearFilters,
}) => {
  const hasActiveFilters = searchQuery.trim() !== '' || selectedCategory !== 'all' || selectedPriority !== 'all';

  return (
    <div className="bg-white border-b border-neutral-200/80 shadow-xs px-4 sm:px-6 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        
        {/* Left: Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por título, responsável, pauta ou detalhes..."
            className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-[#F8FAF9] border border-neutral-200 rounded-lg focus:outline-hidden focus:border-[#0C3B2E] focus:ring-1 focus:ring-[#0C3B2E] text-neutral-900 placeholder:text-neutral-400 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Right: Category and Priority Selectors */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Category Dropdown */}
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-neutral-500 hidden sm:inline" />
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="text-xs sm:text-sm bg-[#F8FAF9] border border-neutral-200 rounded-lg px-2.5 py-2 text-neutral-700 font-medium focus:outline-hidden focus:border-[#0C3B2E] focus:ring-1 focus:ring-[#0C3B2E] max-w-[200px] truncate"
            >
              <option value="all">Todas as Categorias</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Priority Dropdown */}
          <div className="flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-500 hidden sm:inline" />
            <select
              value={selectedPriority}
              onChange={(e) => onPriorityChange(e.target.value)}
              className="text-xs sm:text-sm bg-[#F8FAF9] border border-neutral-200 rounded-lg px-2.5 py-2 text-neutral-700 font-medium focus:outline-hidden focus:border-[#0C3B2E] focus:ring-1 focus:ring-[#0C3B2E]"
            >
              <option value="all">Todas as Prioridades</option>
              <option value="high">Prioridade Alta</option>
              <option value="medium">Prioridade Média</option>
              <option value="low">Prioridade Baixa</option>
            </select>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="flex items-center gap-1 text-xs text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 px-2.5 py-2 rounded-lg border border-rose-200 transition-colors whitespace-nowrap font-medium"
            >
              <X className="w-3 h-3" />
              <span>Limpar filtros</span>
            </button>
          )}

          {/* Counter info */}
          <div className="text-xs text-neutral-500 font-mono tabular-nums ml-auto md:ml-1 pl-2 border-l border-neutral-200 whitespace-nowrap">
            {filteredCount === totalTasks ? (
              <span>{totalTasks} tarefas</span>
            ) : (
              <span>
                {filteredCount} de {totalTasks} tarefas
              </span>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
