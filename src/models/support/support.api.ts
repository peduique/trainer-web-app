/**
 * Support API — uses Asana directly + Supabase triage (mirrors TR[AI]NER Mobile supportApi).
 */

import {
  createAsanaTask,
  searchAsanaTasksByUser,
  getAsanaTask,
  getAsanaTaskStories,
  deleteAsanaTask,
  uploadAsanaAttachment,
  markAsanaTaskRead,
  type AsanaTask,
  type AsanaStory,
  type CreateTaskParams,
  type ReportCategory,
} from './asana-api';
import type { Ticket, TicketComment } from './support.schema';

interface TriageResult {
  success: boolean;
  id: string;
  duplicate: boolean;
  duplicateOf: string | null;
  similarityScore: number | null;
  triage: {
    type: string;
    severity: string;
    escalate: boolean;
    summary: string;
  } | null;
}

async function triageIssue(
  title: string,
  description: string,
  asanaTaskGid: string
): Promise<TriageResult | null> {
  // Only access process.env on the server or during build
  if (typeof window !== 'undefined') {
    return null;
  }

  const triageFunctionUrl = process.env.NEXT_PUBLIC_TRIAGE_FUNCTION_URL ?? '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

  if (!triageFunctionUrl || !supabaseAnonKey) {
    return null;
  }

  try {
    const response = await fetch(triageFunctionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${supabaseAnonKey}`,
      },
      body: JSON.stringify({ title, description, asanaTaskGid }),
    });

    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

function parseCategoryFromName(name: string): Ticket['category'] | undefined {
  const match = name.match(/^\[([^\]]+)\]\s/);
  if (!match) return undefined;
  const cat = match[1].toLowerCase().replace(/\s+/g, '_');
  if (cat === 'bug') return 'bug';
  if (cat === 'feature_request') return 'feature_request';
  if (cat === 'question') return 'question';
  if (cat === 'other') return 'question';
  return undefined;
}

function asanaTaskToTicket(task: AsanaTask): Ticket {
  return {
    gid: task.gid,
    name: task.name,
    description: task.notes || null,
    category: parseCategoryFromName(task.name),
    created_at: task.created_at,
    read: !!task.last_read_at,
  };
}

function asanaStoryToComment(s: AsanaStory): TicketComment {
  return {
    gid: s.gid,
    text: s.text,
    created_at: s.created_at,
    created_by: { name: s.created_by?.name ?? null },
  };
}

export async function fetchTickets(userId: string): Promise<Ticket[]> {
  const tasks = await searchAsanaTasksByUser(userId);
  return tasks.map(asanaTaskToTicket);
}

export async function fetchTicket(gid: string): Promise<Ticket> {
  const task = await getAsanaTask(gid);
  return asanaTaskToTicket(task);
}

export async function fetchTicketComments(gid: string): Promise<TicketComment[]> {
  const stories = await getAsanaTaskStories(gid);
  const comments = stories.filter((s) => s.type === 'comment');
  return comments.map(asanaStoryToComment);
}

const FORM_CATEGORY_TO_ASANA: Record<string, ReportCategory> = {
  bug: 'Bug',
  feature_request: 'Feature Request',
  question: 'Question',
};

export interface CreateTicketParams {
  title: string;
  description: string;
  category: 'bug' | 'feature_request' | 'question';
  screenshot?: File | null;
  user: { id: string; name?: string; email: string };
}

export async function createTicket(params: CreateTicketParams): Promise<Ticket> {
  const { screenshot, user, ...rest } = params;
  const taskParams: CreateTaskParams = {
    ...rest,
    category: FORM_CATEGORY_TO_ASANA[params.category] ?? 'Other',
    user,
  };

  const task = await createAsanaTask(taskParams);

  if (screenshot) {
    uploadAsanaAttachment(task.gid, screenshot).catch(() => {});
  }

  triageIssue(taskParams.title, taskParams.description ?? '', task.gid).catch(() => {});

  return asanaTaskToTicket(task);
}

export async function markTicketAsRead(gid: string): Promise<void> {
  await markAsanaTaskRead(gid);
}

export async function deleteTicket(gid: string): Promise<void> {
  await deleteAsanaTask(gid);
}
