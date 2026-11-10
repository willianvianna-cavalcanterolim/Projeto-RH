import React from 'react';
import { Task, TASK_COLUMNS, TaskStatus } from '../types/task';
import { KanbanColumn } from './KanbanColumn';

interface KanbanBoardProps {
  tasks: Task[];
  onDropTask: (taskId: string, targetStatus: TaskStatus) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onViewTask: (task: Task) => void;
  onAddTaskInColumn: (status: TaskStatus) => void;
  onMoveColumn: (taskId: string, direction: 'prev' | 'next') => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  tasks,
  onDropTask,
  onEditTask,
  onDeleteTask,
  onViewTask,
  onAddTaskInColumn,
  onMoveColumn,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 items-start">
        {TASK_COLUMNS.map((col, index) => {
          const colTasks = tasks.filter((t) => t.status === col.id);
          return (
            <KanbanColumn
              key={col.id}
              column={col}
              tasks={colTasks}
              onDropTask={onDropTask}
              onEditTask={onEditTask}
              onDeleteTask={onDeleteTask}
              onViewTask={onViewTask}
              onAddTaskInColumn={onAddTaskInColumn}
              onMoveColumn={onMoveColumn}
              isFirstColumn={index === 0}
              isLastColumn={index === TASK_COLUMNS.length - 1}
            />
          );
        })}
      </div>
    </div>
  );
};
