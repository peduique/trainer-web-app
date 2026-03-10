/**
 * Asana API client — mirrors TR[AI]NER Mobile store/services/asanaApi.ts
 * Uses NEXT_PUBLIC_ASANA_* (or EXPO_PUBLIC_* via next.config env).
 */

import { getAsanaConfig } from './asana-config';

const ASANA_BASE_URL = 'https://app.asana.com/api/1.0';
const ASANA_USERID_FIELD_GID = '1213528194350621';
const ASANA_LASTREADAT_FIELD_GID = '1213529841045055';

function getAsanaHeaders(): Record<string, string> {
  const { pat } = getAsanaConfig();
  return {
    Authorization: `Bearer ${pat}`,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
}

export interface AsanaTask {
  gid: string;
  name: string;
  notes: string;
  completed: boolean;
  created_at: string;
  modified_at: string;
  custom_fields?: Array<{
    gid: string;
    display_value: string | null;
    date_value?: { date_time?: string; date?: string } | null;
  }>;
  last_read_at?: string | null;
}

export type ReportCategory = 'Bug' | 'Feature Request' | 'Question' | 'Other';

export interface CreateTaskParams {
  title: string;
  description: string;
  category: ReportCategory;
  user: { id: string; name?: string; email: string };
}

function buildTaskNotes(description: string, user: CreateTaskParams['user']): string {
  return [
    description,
    '',
    '---',
    `Reported by: ${user.name ?? 'Unknown'} (${user.email})`,
    `User ID: ${user.id}`,
    `Device: Web (Trainer Portal)`,
  ].join('\n');
}

async function asanaFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${ASANA_BASE_URL}${path}`, {
    ...init,
    headers: {
      ...getAsanaHeaders(),
      ...(init?.headers as Record<string, string> | undefined),
    },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Asana API ${res.status}: ${body}`);
  }

  const json = await res.json();
  return json.data as T;
}

export async function createAsanaTask(params: CreateTaskParams): Promise<AsanaTask> {
  const { title, description, category, user } = params;
  const { projectGid } = getAsanaConfig();

  const task = await asanaFetch<AsanaTask>('/tasks', {
    method: 'POST',
    body: JSON.stringify({
      data: {
        name: `[${category}] ${title}`,
        notes: buildTaskNotes(description, user),
        projects: [projectGid],
        custom_fields: { [ASANA_USERID_FIELD_GID]: String(user.id) },
      },
    }),
  });

  return task;
}

function extractLastReadAt(task: AsanaTask): AsanaTask {
  const field = task.custom_fields?.find((f) => f.gid === ASANA_LASTREADAT_FIELD_GID);
  const value =
    field?.date_value?.date_time ?? field?.date_value?.date ?? field?.display_value ?? null;
  return { ...task, last_read_at: value };
}

let cachedWorkspaceGid: string | null = null;
async function getWorkspaceGid(): Promise<string> {
  if (cachedWorkspaceGid) return cachedWorkspaceGid;
  const { projectGid } = getAsanaConfig();
  const project = await asanaFetch<{ workspace: { gid: string } }>(
    `/projects/${projectGid}?opt_fields=workspace`
  );
  cachedWorkspaceGid = (project as { workspace?: { gid?: string } }).workspace?.gid ?? null;
  return cachedWorkspaceGid!;
}

export async function searchAsanaTasksByUser(userId: string): Promise<AsanaTask[]> {
  const { projectGid } = getAsanaConfig();
  const fields =
    'gid,name,notes,completed,created_at,modified_at,custom_fields.gid,custom_fields.display_value,custom_fields.date_value';
  const params = new URLSearchParams({
    opt_fields: fields,
    'projects.any': projectGid,
    [`custom_fields.${ASANA_USERID_FIELD_GID}.value`]: String(userId),
    sort_by: 'created_at',
    sort_ascending: 'false',
  });
  const workspaceGid = await getWorkspaceGid();
  const tasks = await asanaFetch<AsanaTask[]>(
    `/workspaces/${workspaceGid}/tasks/search?${params.toString()}`
  );
  return (Array.isArray(tasks) ? tasks : []).map(extractLastReadAt);
}

export async function getAsanaTask(taskGid: string): Promise<AsanaTask> {
  const fields = 'gid,name,notes,completed,created_at,modified_at';
  return asanaFetch<AsanaTask>(`/tasks/${taskGid}?opt_fields=${fields}`);
}

export interface AsanaStory {
  gid: string;
  text: string;
  type: 'comment' | 'system';
  created_by: { gid: string; name: string };
  created_at: string;
}

export async function getAsanaTaskStories(taskGid: string): Promise<AsanaStory[]> {
  const fields = 'gid,text,type,created_by,created_at';
  return asanaFetch<AsanaStory[]>(`/tasks/${taskGid}/stories?opt_fields=${fields}`);
}

export async function markAsanaTaskRead(taskGid: string): Promise<void> {
  await asanaFetch(`/tasks/${taskGid}`, {
    method: 'PUT',
    body: JSON.stringify({
      data: {
        custom_fields: { [ASANA_LASTREADAT_FIELD_GID]: { date_time: new Date().toISOString() } },
      },
    }),
  });
}

export async function deleteAsanaTask(taskGid: string): Promise<void> {
  await asanaFetch(`/tasks/${taskGid}`, { method: 'DELETE' });
}

export async function uploadAsanaAttachment(taskGid: string, file: File): Promise<void> {
  const { pat } = getAsanaConfig();
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${ASANA_BASE_URL}/tasks/${taskGid}/attachments`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${pat}` },
    body: formData,
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Asana attachment upload ${res.status}: ${body}`);
  }
}
