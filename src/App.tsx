import React, { useState, useEffect, useMemo } from 'react';
import { Task, TaskStatus, PRESET_CATEGORIES, TASK_COLUMNS } from './types/task';
import { INITIAL_TASKS } from './data/initialTasks';
import { Header } from './components/Header';
import { FilterBar } from './components/FilterBar';
import { KanbanBoard } from './components/KanbanBoard';
import { ListView } from './components/ListView';
import { MetricsView } from './components/MetricsView';
import { TaskModal } from './components/TaskModal';
import { TaskDetailModal } from './components/TaskDetailModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { ResetConfirmModal } from './components/ResetConfirmModal';

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentView, setCurrentView] = useState<'kanban' | 'list' | 'metrics'>('kanban');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');

  // Modals
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [defaultStatusForNew, setDefaultStatusForNew] = useState<TaskStatus>('todo');

  const [selectedDetailTask, setSelectedDetailTask] = useState<Task | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  // Load tasks from backend database API with fallback
  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/tasks');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setTasks(data);
          return;
        }
      }
      // If server returned empty or failed, load initial seed
      setTasks(INITIAL_TASKS);
    } catch (err) {
      console.warn('Backend API unavailable, using local initial tasks dataset:', err);
      setTasks(INITIAL_TASKS);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Compute all available categories from current tasks + presets
  const availableCategories = useMemo(() => {
    const set = new Set<string>(PRESET_CATEGORIES);
    tasks.forEach((t) => {
      if (t.category) set.add(t.category);
    });
    return Array.from(set);
  }, [tasks]);

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = task.title.toLowerCase().includes(q);
        const matchesDesc = (task.description || '').toLowerCase().includes(q);
        const matchesAssignee = (task.assignee || '').toLowerCase().includes(q);
        const matchesCategory = (task.category || '').toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesAssignee && !matchesCategory) {
          return false;
        }
      }

      // Category filter
      if (selectedCategory !== 'all' && task.category !== selectedCategory) {
        return false;
      }

      // Priority filter
      if (selectedPriority !== 'all' && task.priority !== selectedPriority) {
        return false;
      }

      return true;
    });
  }, [tasks, searchQuery, selectedCategory, selectedPriority]);

  // Handler: Create or Update Task
  const handleSaveTask = async (taskData: Partial<Task>) => {
    if (taskToEdit) {
      // Update existing
      const updatedFields: Task = {
        ...taskToEdit,
        ...taskData,
        updated_at: new Date().toISOString(),
      } as Task;

      // Optimistic update
      setTasks((prev) => prev.map((t) => (t.id === taskToEdit.id ? updatedFields : t)));
      if (selectedDetailTask?.id === taskToEdit.id) {
        setSelectedDetailTask(updatedFields);
      }

      try {
        const res = await fetch(`/api/tasks/${taskToEdit.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(taskData),
        });
        if (res.ok) {
          const saved = await res.json();
          setTasks((prev) => prev.map((t) => (t.id === taskToEdit.id ? saved : t)));
        }
      } catch (err) {
        console.error('Failed to update task in backend:', err);
      }
    } else {
      // Create new
      const tempId = `task-${Date.now()}`;
      const now = new Date().toISOString();
      const newTask: Task = {
        id: tempId,
        title: taskData.title || 'Nova Demanda',
        category: taskData.category || 'Geral',
        description: taskData.description || '',
        status: taskData.status || defaultStatusForNew,
        priority: taskData.priority || 'medium',
        assignee: taskData.assignee || 'Equipe RH/DP',
        due_date: taskData.due_date || new Date().toISOString().split('T')[0],
        created_at: now,
        updated_at: now,
      };

      // Optimistic update
      setTasks((prev) => [newTask, ...prev]);

      try {
        const res = await fetch('/api/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(taskData),
        });
        if (res.ok) {
          const created = await res.json();
          setTasks((prev) => prev.map((t) => (t.id === tempId ? created : t)));
        }
      } catch (err) {
        console.error('Failed to create task in backend:', err);
      }
    }

    setTaskToEdit(null);
    setIsTaskModalOpen(false);
  };

  // Handler: Status change / Drag and Drop
  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    // Optimistic update
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus, updated_at: new Date().toISOString() } : t))
    );

    if (selectedDetailTask && selectedDetailTask.id === taskId) {
      setSelectedDetailTask((prev) => (prev ? { ...prev, status: newStatus } : null));
    }

    try {
      await fetch(`/api/tasks/${taskId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (err) {
      console.error('Failed to update status in backend:', err);
    }
  };

  // Quick Move Column (Prev / Next)
  const handleMoveColumn = (taskId: string, direction: 'prev' | 'next') => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const columnOrder: TaskStatus[] = ['todo', 'in_progress', 'waiting', 'done'];
    const currentIndex = columnOrder.indexOf(task.status);
    if (currentIndex === -1) return;

    const newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    if (newIndex >= 0 && newIndex < columnOrder.length) {
      handleStatusChange(taskId, columnOrder[newIndex]);
    }
  };

  // Handler: Delete Task
  const confirmDelete = async () => {
    if (!taskToDelete) return;
    const id = taskToDelete.id;

    // Optimistic remove
    setTasks((prev) => prev.filter((t) => t.id !== id));
    setIsDeleteModalOpen(false);
    setTaskToDelete(null);

    if (selectedDetailTask?.id === id) {
      setIsDetailModalOpen(false);
      setSelectedDetailTask(null);
    }

    try {
      await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
      });
    } catch (err) {
      console.error('Failed to delete task in backend:', err);
    }
  };

  // Handler: Reset Seed Data
  const confirmResetSeed = async () => {
    setIsResetModalOpen(false);
    setIsLoading(true);
    try {
      const res = await fetch('/api/tasks/reset', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setTasks(data.tasks);
      } else {
        setTasks(INITIAL_TASKS);
      }
    } catch (err) {
      console.error('Failed to reset tasks in backend:', err);
      setTasks(INITIAL_TASKS);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenNewInColumn = (status: TaskStatus) => {
    setTaskToEdit(null);
    setDefaultStatusForNew(status);
    setIsTaskModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F6F5] text-neutral-800 antialiased selection:bg-[#C5A059]/30">
      
      {/* Top Header */}
      <Header
        currentView={currentView}
        onViewChange={setCurrentView}
        onNewTask={() => {
          setTaskToEdit(null);
          setDefaultStatusForNew('todo');
          setIsTaskModalOpen(true);
        }}
        onResetSeed={() => setIsResetModalOpen(true)}
        tasks={tasks}
      />

      {/* Filter and Search Bar */}
      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedPriority={selectedPriority}
        onPriorityChange={setSelectedPriority}
        categories={availableCategories}
        totalTasks={tasks.length}
        filteredCount={filteredTasks.length}
        onClearFilters={() => {
          setSearchQuery('');
          setSelectedCategory('all');
          setSelectedPriority('all');
        }}
      />

      {/* Main Viewport Content */}
      <main className="flex-1">
        {isLoading ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full border-3 border-[#C5A059] border-t-transparent animate-spin mb-4" />
            <p className="text-sm font-semibold text-[#0C3B2E] tracking-wide">
              Carregando demandas da Cavalcante & Rolim...
            </p>
          </div>
        ) : (
          <>
            {currentView === 'kanban' && (
              <KanbanBoard
                tasks={filteredTasks}
                onDropTask={handleStatusChange}
                onEditTask={(task) => {
                  setTaskToEdit(task);
                  setIsTaskModalOpen(true);
                }}
                onDeleteTask={(id) => {
                  const task = tasks.find((t) => t.id === id);
                  if (task) {
                    setTaskToDelete(task);
                    setIsDeleteModalOpen(true);
                  }
                }}
                onViewTask={(task) => {
                  setSelectedDetailTask(task);
                  setIsDetailModalOpen(true);
                }}
                onAddTaskInColumn={handleOpenNewInColumn}
                onMoveColumn={handleMoveColumn}
              />
            )}

            {currentView === 'list' && (
              <ListView
                tasks={filteredTasks}
                onEditTask={(task) => {
                  setTaskToEdit(task);
                  setIsTaskModalOpen(true);
                }}
                onDeleteTask={(id) => {
                  const task = tasks.find((t) => t.id === id);
                  if (task) {
                    setTaskToDelete(task);
                    setIsDeleteModalOpen(true);
                  }
                }}
                onViewTask={(task) => {
                  setSelectedDetailTask(task);
                  setIsDetailModalOpen(true);
                }}
                onStatusChange={handleStatusChange}
              />
            )}

            {currentView === 'metrics' && (
              <MetricsView
                tasks={filteredTasks}
                onViewTask={(task) => {
                  setSelectedDetailTask(task);
                  setIsDetailModalOpen(true);
                }}
              />
            )}
          </>
        )}
      </main>

      {/* Corporate Luxury Footer */}
      <footer className="bg-white border-t border-neutral-200/80 py-5 text-center text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-brand font-bold text-[#0C3B2E] tracking-wider text-xs">
              CAVALCANTE & ROLIM
            </span>
            <span>·</span>
            <span className="text-[11px] font-medium text-[#C5A059]">
              SIGNATURE SPACES
            </span>
          </div>
          <div className="text-[11px] text-neutral-500">
            Implantação de Recursos Humanos & Departamento Pessoal · Maceió & Região
          </div>
          <div className="text-[11px] font-mono text-neutral-400 tabular-nums">
            Persistência em Banco Ativa
          </div>
        </div>
      </footer>

      {/* Create / Edit Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setTaskToEdit(null);
        }}
        onSave={handleSaveTask}
        taskToEdit={taskToEdit}
        defaultStatus={defaultStatusForNew}
      />

      {/* Task Details Modal */}
      <TaskDetailModal
        task={selectedDetailTask}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedDetailTask(null);
        }}
        onEdit={(task) => {
          setTaskToEdit(task);
          setIsTaskModalOpen(true);
        }}
        onDelete={(id) => {
          const task = tasks.find((t) => t.id === id);
          if (task) {
            setTaskToDelete(task);
            setIsDeleteModalOpen(true);
          }
        }}
        onStatusChange={handleStatusChange}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        task={taskToDelete}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setTaskToDelete(null);
        }}
        onConfirm={confirmDelete}
      />

      {/* Reset Seed Confirmation Modal */}
      <ResetConfirmModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={confirmResetSeed}
      />

    </div>
  );
}
