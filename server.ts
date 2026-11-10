import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { INITIAL_TASKS } from './src/data/initialTasks.ts';
import { Task, TaskStatus } from './src/types/task.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const DATA_DIR = path.resolve(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'tasks.json');

app.use(express.json());

// Ensure data directory and file exist
function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(INITIAL_TASKS, null, 2), 'utf-8');
  }
}

function readTasks(): Task[] {
  try {
    ensureDataFile();
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(data);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    // If empty array, fallback to initial
    fs.writeFileSync(DATA_FILE, JSON.stringify(INITIAL_TASKS, null, 2), 'utf-8');
    return INITIAL_TASKS;
  } catch (err) {
    console.error('Error reading tasks database file:', err);
    return INITIAL_TASKS;
  }
}

function writeTasks(tasks: Task[]): void {
  try {
    ensureDataFile();
    fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing tasks database file:', err);
  }
}

// REST API Endpoints
app.get('/api/tasks', (_req: Request, res: Response) => {
  const tasks = readTasks();
  res.json(tasks);
});

app.post('/api/tasks', (req: Request, res: Response) => {
  const { title, category, description, status, priority, assignee, due_date } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ error: 'O título da tarefa é obrigatório.' });
  }

  const tasks = readTasks();
  const now = new Date().toISOString();
  const newTask: Task = {
    id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    title: String(title).trim(),
    category: String(category || 'Geral').trim(),
    description: String(description || '').trim(),
    status: (status as TaskStatus) || 'todo',
    priority: priority || 'medium',
    assignee: String(assignee || 'A definir').trim(),
    due_date: due_date || new Date().toISOString().split('T')[0],
    created_at: now,
    updated_at: now,
  };

  tasks.unshift(newTask);
  writeTasks(tasks);
  res.status(201).json(newTask);
});

app.put('/api/tasks/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, category, description, status, priority, assignee, due_date } = req.body;

  const tasks = readTasks();
  const index = tasks.findIndex((t) => t.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Tarefa não encontrada.' });
  }

  const now = new Date().toISOString();
  const updatedTask: Task = {
    ...tasks[index],
    title: title !== undefined ? String(title).trim() : tasks[index].title,
    category: category !== undefined ? String(category).trim() : tasks[index].category,
    description: description !== undefined ? String(description).trim() : tasks[index].description,
    status: status !== undefined ? (status as TaskStatus) : tasks[index].status,
    priority: priority !== undefined ? priority : tasks[index].priority,
    assignee: assignee !== undefined ? String(assignee).trim() : tasks[index].assignee,
    due_date: due_date !== undefined ? due_date : tasks[index].due_date,
    updated_at: now,
  };

  tasks[index] = updatedTask;
  writeTasks(tasks);
  res.json(updatedTask);
});

app.patch('/api/tasks/:id/status', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status || !['todo', 'in_progress', 'waiting', 'done'].includes(status)) {
    return res.status(400).json({ error: 'Status inválido fornecido.' });
  }

  const tasks = readTasks();
  const index = tasks.findIndex((t) => t.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Tarefa não encontrada.' });
  }

  const updatedTask: Task = {
    ...tasks[index],
    status: status as TaskStatus,
    updated_at: new Date().toISOString(),
  };

  tasks[index] = updatedTask;
  writeTasks(tasks);
  res.json(updatedTask);
});

app.delete('/api/tasks/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const tasks = readTasks();
  const initialLength = tasks.length;
  const filtered = tasks.filter((t) => t.id !== id);

  if (filtered.length === initialLength) {
    return res.status(404).json({ error: 'Tarefa não encontrada para exclusão.' });
  }

  writeTasks(filtered);
  res.json({ success: true, id });
});

app.post('/api/tasks/reset', (_req: Request, res: Response) => {
  writeTasks(INITIAL_TASKS);
  res.json({ success: true, tasks: INITIAL_TASKS });
});

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Setup Vite or static serving
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Cavalcante & Rolim Kanban Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
