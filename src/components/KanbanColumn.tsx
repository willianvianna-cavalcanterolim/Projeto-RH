import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Task, TaskColumn, TaskStatus } from '../types/task';
import { TaskCard } from './TaskCard';

interface KanbanColumnProps {
  column: TaskColumn;
  tasks: Task[];
  onDropTask: (taskId: string, targetStatus: TaskStatus) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onViewTask: (task: Task) => void;
  onAddTaskInColumn: (status: TaskStatus) => void;
  onMoveColumn: (taskId: string, direction: 'prev' | 'next') => void;
  isFirstColumn: boolean;
  isLastColumn: boolean;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  column,
  tasks,
  onDropTask,
  onEditTask,
  onDeleteTask,
  onViewTask,
  onAddTaskInColumn,
  onMoveColumn,
  isFirstColumn,
  isLastColumn,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (!isDragOver) setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // Check if leaving current column container
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) {
      onDropTask(taskId, column.id);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex flex-col rounded-2xl bg-[#ECEFEF]/70 border transition-all duration-200 min-h-[580px] p-3.5 sm:p-4 ${
        isDragOver
          ? 'border-[#C5A059] bg-[#E2EBE7] ring-2 ring-[#C5A059]/40'
          : 'border-neutral-200/80 shadow-xs'
      }`}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-neutral-200/90">
        <div className="flex items-center gap-2">
          {/* Status Color Pip */}
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: column.color }}
          />
          <h2 className="font-semibold text-sm sm:text-base text-neutral-900 tracking-tight">
            {column.title}
          </h2>
          <span className="text-xs font-mono tabular-nums px-2 py-0.5 rounded-full bg-white border border-neutral-200 text-neutral-600 font-semibold shadow-2xs">
            {tasks.length}
          </span>
        </div>

        {/* Quick Add Button */}
        <button
          onClick={() => onAddTaskInColumn(column.id)}
          className="p-1.5 text-neutral-500 hover:text-[#0C3B2E] hover:bg-white rounded-lg transition-colors border border-transparent hover:border-neutral-200"
          title={`Adicionar tarefa em ${column.title}`}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Task List / Drop Area */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-0.5">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={onEditTask}
            onDelete={onDeleteTask}
            onViewDetails={onViewTask}
            onMoveColumn={onMoveColumn}
            isFirstColumn={isFirstColumn}
            isLastColumn={isLastColumn}
          />
        ))}

        {tasks.length === 0 && (
          <div
            onClick={() => onAddTaskInColumn(column.id)}
            className="h-32 border-2 border-dashed border-neutral-300 rounded-xl flex flex-col items-center justify-center text-center p-4 cursor-pointer hover:border-[#C5A059] hover:bg-white/60 transition-all text-neutral-400 hover:text-[#0C3B2E]"
          >
            <Plus className="w-5 h-5 mb-1 stroke-1" />
            <span className="text-xs font-medium">Nenhuma tarefa nesta coluna</span>
            <span className="text-[11px] text-neutral-400">Clique para adicionar</span>
          </div>
        )}
      </div>
    </div>
  );
};
