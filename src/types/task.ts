export type TaskStatus = 'todo' | 'in_progress' | 'waiting' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  category: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: string;
  due_date: string; // YYYY-MM-DD
  created_at: string; // ISO string
  updated_at: string; // ISO string
}

export interface TaskColumn {
  id: TaskStatus;
  title: string;
  subtitle: string;
  color: string;
  badgeBg: string;
}

export const TASK_COLUMNS: TaskColumn[] = [
  {
    id: 'todo',
    title: 'A Fazer',
    subtitle: 'Backlog e novas demandas priorizadas',
    color: '#64748B',
    badgeBg: 'bg-slate-100 text-slate-700',
  },
  {
    id: 'in_progress',
    title: 'Em Andamento',
    subtitle: 'Demandas em execução ativa pelo time',
    color: '#0C3B2E',
    badgeBg: 'bg-emerald-100 text-emerald-900',
  },
  {
    id: 'waiting',
    title: 'Aguardando Aprovação / Terceiros',
    subtitle: 'Dependências de parceiros, prefeitura ou diretoria',
    color: '#D97706',
    badgeBg: 'bg-amber-100 text-amber-900',
  },
  {
    id: 'done',
    title: 'Concluído',
    subtitle: 'Pautas finalizadas e homologadas',
    color: '#15803D',
    badgeBg: 'bg-green-100 text-green-900',
  },
];

export const PRESET_CATEGORIES = [
  'Uniformização e Imagem Corporativa',
  'Atração, Seleção e Impacto Social',
  'Mapeamento de Processos e Eficiência do DP',
  'Saúde, Segurança do Trabalho (SST) e Qualidade de Vida',
  'Cargos, Salários e Gestão Estratégica',
  'Benefícios e Bem-Estar',
  'Desenvolvimento e Cultura Organizacional',
] as const;

export const PRIORITY_CONFIG = {
  high: {
    label: 'Alta',
    badgeClass: 'text-rose-700 bg-rose-50 border-rose-200',
    indicatorClass: 'bg-rose-600',
  },
  medium: {
    label: 'Média',
    badgeClass: 'text-amber-700 bg-amber-50 border-amber-200',
    indicatorClass: 'bg-amber-500',
  },
  low: {
    label: 'Baixa',
    badgeClass: 'text-slate-600 bg-slate-50 border-slate-200',
    indicatorClass: 'bg-slate-400',
  },
} as const;
