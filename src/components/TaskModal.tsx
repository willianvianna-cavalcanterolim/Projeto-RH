import React, { useState, useEffect } from 'react';
import { X, Calendar, User, Tag, AlertTriangle } from 'lucide-react';
import { Task, TaskPriority, TaskStatus, PRESET_CATEGORIES, TASK_COLUMNS } from '../types/task';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskData: Partial<Task>) => void;
  taskToEdit?: Task | null;
  defaultStatus?: TaskStatus;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  taskToEdit,
  defaultStatus = 'todo',
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<string>(PRESET_CATEGORIES[0]);
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customCategory, setCustomCategory] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>(defaultStatus);
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [assignee, setAssignee] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      if (PRESET_CATEGORIES.includes(taskToEdit.category as any)) {
        setCategory(taskToEdit.category);
        setIsCustomCategory(false);
        setCustomCategory('');
      } else {
        setCategory('Outra');
        setIsCustomCategory(true);
        setCustomCategory(taskToEdit.category);
      }
      setDescription(taskToEdit.description || '');
      setStatus(taskToEdit.status);
      setPriority(taskToEdit.priority);
      setAssignee(taskToEdit.assignee || '');
      setDueDate(taskToEdit.due_date || '');
    } else {
      setTitle('');
      setCategory(PRESET_CATEGORIES[0]);
      setIsCustomCategory(false);
      setCustomCategory('');
      setDescription('');
      setStatus(defaultStatus);
      setPriority('medium');
      setAssignee('');
      // Default due date: 7 days from now formatted YYYY-MM-DD
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      setDueDate(nextWeek.toISOString().split('T')[0]);
    }
    setError('');
  }, [taskToEdit, defaultStatus, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Por favor, informe o título da tarefa.');
      return;
    }

    const finalCategory = isCustomCategory ? (customCategory.trim() || 'Geral') : category;

    onSave({
      title: title.trim(),
      category: finalCategory,
      description: description.trim(),
      status,
      priority,
      assignee: assignee.trim() || 'Equipe RH/DP',
      due_date: dueDate || new Date().toISOString().split('T')[0],
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-neutral-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Emerald Deep Theme */}
        <div className="bg-[#0C3B2E] px-6 py-4.5 flex items-center justify-between text-white border-b border-[#C5A059]/40">
          <div>
            <span className="text-[11px] font-semibold tracking-wider text-[#DFBF7A] uppercase">
              Cavalcante & Rolim · Gestão de Demandas
            </span>
            <h2 className="text-lg font-bold">
              {taskToEdit ? 'Editar Tarefa de Implantação' : 'Cadastrar Nova Demanda'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-emerald-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4.5 max-h-[75vh] overflow-y-auto">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-neutral-800 uppercase tracking-wide mb-1.5">
              Título da Tarefa / Pauta *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError('');
              }}
              placeholder="Ex: Uniformes Operacionais, Jovem Aprendiz..."
              className="w-full px-3.5 py-2.5 text-sm bg-[#F9FBFA] border border-neutral-300 rounded-lg focus:outline-hidden focus:border-[#0C3B2E] focus:ring-1 focus:ring-[#0C3B2E] text-neutral-900"
              autoFocus
            />
          </div>

          {/* Category & Status Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-neutral-800 uppercase tracking-wide mb-1.5">
                Categoria / Área
              </label>
              <select
                value={isCustomCategory ? 'custom' : category}
                onChange={(e) => {
                  if (e.target.value === 'custom') {
                    setIsCustomCategory(true);
                  } else {
                    setIsCustomCategory(false);
                    setCategory(e.target.value);
                  }
                }}
                className="w-full px-3 py-2 text-sm bg-[#F9FBFA] border border-neutral-300 rounded-lg focus:outline-hidden focus:border-[#0C3B2E] focus:ring-1 focus:ring-[#0C3B2E] text-neutral-900"
              >
                {PRESET_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
                <option value="custom">+ Outra (Personalizada)</option>
              </select>

              {isCustomCategory && (
                <input
                  type="text"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  placeholder="Nome da nova categoria..."
                  className="mt-2 w-full px-3 py-2 text-sm bg-[#F9FBFA] border border-neutral-300 rounded-lg focus:outline-hidden focus:border-[#0C3B2E] focus:ring-1 focus:ring-[#0C3B2E] text-neutral-900"
                />
              )}
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-semibold text-neutral-800 uppercase tracking-wide mb-1.5">
                Coluna / Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full px-3 py-2 text-sm bg-[#F9FBFA] border border-neutral-300 rounded-lg focus:outline-hidden focus:border-[#0C3B2E] focus:ring-1 focus:ring-[#0C3B2E] text-neutral-900"
              >
                {TASK_COLUMNS.map((col) => (
                  <option key={col.id} value={col.id}>
                    {col.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Priority & Due Date & Assignee Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Priority */}
            <div>
              <label className="block text-xs font-semibold text-neutral-800 uppercase tracking-wide mb-1.5">
                Prioridade
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full px-3 py-2 text-sm bg-[#F9FBFA] border border-neutral-300 rounded-lg focus:outline-hidden focus:border-[#0C3B2E] focus:ring-1 focus:ring-[#0C3B2E] text-neutral-900 font-medium"
              >
                <option value="high">Alta Prioridade</option>
                <option value="medium">Média Prioridade</option>
                <option value="low">Baixa Prioridade</option>
              </select>
            </div>

            {/* Assignee */}
            <div>
              <label className="block text-xs font-semibold text-neutral-800 uppercase tracking-wide mb-1.5">
                Responsável
              </label>
              <input
                type="text"
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                placeholder="Ex: Larissa (Compras), David..."
                className="w-full px-3 py-2 text-sm bg-[#F9FBFA] border border-neutral-300 rounded-lg focus:outline-hidden focus:border-[#0C3B2E] focus:ring-1 focus:ring-[#0C3B2E] text-neutral-900"
              />
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-xs font-semibold text-neutral-800 uppercase tracking-wide mb-1.5">
                Prazo / Data
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-[#F9FBFA] border border-neutral-300 rounded-lg focus:outline-hidden focus:border-[#0C3B2E] focus:ring-1 focus:ring-[#0C3B2E] text-neutral-900 font-mono"
              />
            </div>
          </div>

          {/* Detailed Description */}
          <div>
            <label className="block text-xs font-semibold text-neutral-800 uppercase tracking-wide mb-1.5">
              Descrição Detalhada & Pendências
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva o escopo, fornecedores, etapas pendentes ou parceiros aguardados (ex: Aguardando retorno de David...)"
              className="w-full px-3.5 py-2.5 text-sm bg-[#F9FBFA] border border-neutral-300 rounded-lg focus:outline-hidden focus:border-[#0C3B2E] focus:ring-1 focus:ring-[#0C3B2E] text-neutral-900 leading-relaxed placeholder:text-neutral-400"
            />
          </div>

          {/* Modal Footer */}
          <div className="pt-3 border-t border-neutral-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs sm:text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs sm:text-sm font-semibold text-[#0C3B2E] bg-gradient-to-r from-[#DFBF7A] via-[#C5A059] to-[#A68339] rounded-lg shadow-sm hover:brightness-110 active:scale-[0.98] transition-all border border-[#DFBF7A]"
            >
              {taskToEdit ? 'Salvar Alterações' : 'Criar Tarefa'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
