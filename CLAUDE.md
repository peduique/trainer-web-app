# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TRAINER Web is a Next.js 16 frontend application for a B2B SaaS platform. It follows Feature-Based Architecture with concepts borrowed from Feature-Sliced Design, communicates with a Ruby on Rails REST API, and is deployed via Docker to AWS ECS.

### Starting Development

```bash
# Start with hot reload (recommended for development)
make dev
# or
npm run dev
```

### Running Tests

```bash
# Unit tests with coverage (80% threshold required)
make utest

# Watch mode for test-driven development
make utest-watch

# Mutation testing (validates test quality)
make mtest

# E2E tests with Playwright
make e2e

# Run all tests (unit, coverage, mutation, e2e)
make test-all
```

### Running Single Tests

```bash
# Run specific test file
npx vitest run src/features/settings/components/profile-form.spec.tsx

# Watch mode for specific test
npx vitest src/features/settings/components/profile-form.spec.tsx
```

### Building and Docker

```bash
# Build for production
npm run build

# Build and run in Docker
make run

# View container logs
make logs

# Access container shell
make shell

# Stop container
make stop
```

### Code Quality

```bash
# Lint with ESLint
make lint

# Format with Prettier
make format

# Type checking
npm run type-check
```

## Architecture

### Project Structure

The codebase follows **Feature-Based Architecture** with concepts from Feature-Sliced Design:

```
src/
├── proxy.ts                # Route protection (Next.js 16 proxy)
├── app/                    # Next.js App Router pages
│   ├── (auth)/             # Auth route group (login, register)
│   ├── (dashboard)/        # Dashboard route group
│   ├── layout.tsx          # Root layout
│   ├── error.tsx           # Global error page
│   └── not-found.tsx       # 404 page
│
├── features/               # Feature modules (self-contained)
│   ├── auth/               # Authentication feature
│   │   └── components/     # Auth UI (UserInfo, LogoutLink, AuthenticatedContent)
│   └── [feature]/
│       ├── components/     # Feature-specific components
│       ├── hooks/          # Feature-specific hooks
│       ├── schemas/        # Zod schemas for forms
│       ├── types/          # Feature-specific types
│       └── [feature]-page.tsx
│
├── models/                 # Shared business objects
│   ├── auth/               # Auth model (schema + API)
│   │   ├── auth.schema.ts  # Zod schema + types
│   │   └── auth.api.ts     # REST API functions
│   └── [entity]/
│       ├── [entity].schema.ts  # Zod schema + type
│       └── [entity].api.ts     # REST API functions (fetch, create, update, delete)
│
├── components/             # Shared components
│   ├── ui/                 # Generic UI (button, input)
│   ├── layout/             # Layout components
│   └── providers/          # Context providers
│
├── config/                 # Environment configuration
│   └── env.ts              # Validated env vars with Zod
├── hooks/                  # Shared hooks (use-auth, useFeatureToggle)
├── lib/                    # Third-party integrations
│   ├── query/              # TanStack Query client setup
│
├── schemas/                # Shared Zod schemas
├── types/                  # Shared TypeScript types
└── utils/                  # Shared utilities
```

### Key Architectural Rules

1. **Features are self-contained** - Everything a feature needs lives in its folder
2. **Features cannot import from other features** - Extract shared code to models or shared folders
3. **Entities own their schema and API** - Zod schemas and REST API functions together
4. **Extract to shared only when reused** - Move to shared folders when used by 2+ features
5. **`lib/` wraps third-party integrations** - Easy to mock and swap

### Import Rules

```
app/ → features/ → models/ → components/, hooks/, lib/, schemas/, types/, utils/
```

Features can import from models and shared folders, but NOT from other features.

## React & Next.js Patterns

### Server Components vs Client Components

**Default to Server Components.** Only add `'use client'` when you need:

- `useState`, `useEffect`, or other hooks
- Event handlers (`onClick`, `onChange`)
- Browser APIs (`window`, `localStorage`)
- TanStack Query hooks (`useQuery`, `useMutation`)
- React Hook Form

```typescript
// Server Component (default) - no directive needed
export function DashboardHeader({ user }: { user: User }) {
  return <h1>Welcome, {user.name}</h1>;
}

// Client Component - only when needed
'use client';

export function DashboardChart({ data }: { data: ChartData }) {
  const [activeIndex, setActiveIndex] = useState(0);
  // ...
}
```

### React 19 Patterns

**Ref as prop (no forwardRef):**

```typescript
interface InputProps {
  ref?: React.Ref<HTMLInputElement>;
}

export function Input({ ref, ...props }: InputProps) {
  return <input ref={ref} {...props} />;
}
```

**Context shorthand:**

```typescript
// Use this (React 19)
<ThemeContext value={{ theme, setTheme }}>
  {children}
</ThemeContext>

// Not this (legacy)
<ThemeContext.Provider value={{ theme, setTheme }}>
```

**Suspense strategy:**

- Page-level Suspense by default
- Component-level only for heavy components (charts, large tables)

### Page Structure

```typescript
// app/(dashboard)/settings/page.tsx
import { Suspense } from 'react';
import type { Metadata } from 'next';

import { SettingsPage } from '@/features/settings/settings-page';
import { SettingsSkeleton } from '@/features/settings/components/settings-skeleton';

export const metadata: Metadata = {
  title: 'Settings',
};

export default function Page() {
  return (
    <Suspense fallback={<SettingsSkeleton />}>
      <SettingsPage />
    </Suspense>
  );
}
```

## State Management

### Decision Tree

```
Is it server data?
├── Yes → TanStack Query (useQuery / useMutation)
└── No  → Is it needed by multiple components?
          ├── Yes → React Context
          └── No  → Local useState
```

### TanStack Query for REST APIs

Use TanStack Query for all server data fetching:

```typescript
// Setup - lib/query/client.ts
import { QueryClient } from '@tanstack/react-query';

export function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        refetchOnWindowFocus: false,
      },
    },
  });
}
```

**Query hook pattern:**

```typescript
// models/workspace/workspace.api.ts
import { env } from '@/config/env';

export async function fetchWorkspaces(): Promise<Workspace[]> {
  const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/workspaces`, {
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to fetch workspaces');
  return response.json();
}

// features/workspace/hooks/use-workspaces.ts
import { useQuery } from '@tanstack/react-query';
import { fetchWorkspaces } from '@/models/workspace/workspace.api';

export const WORKSPACES_QUERY_KEY = ['workspaces'] as const;

export function useWorkspaces() {
  const { data, isLoading, error } = useQuery({
    queryKey: WORKSPACES_QUERY_KEY,
    queryFn: fetchWorkspaces,
    staleTime: 60 * 1000,
  });

  return {
    workspaces: data ?? [],
    isLoading,
    error: error instanceof Error ? error : null,
  };
}
```

**Mutation pattern with cache invalidation:**

```typescript
// models/workspace/workspace.api.ts
export async function createWorkspace(data: CreateWorkspaceInput): Promise<Workspace> {
  const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/workspaces`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create workspace');
  return response.json();
}

// features/workspace/hooks/use-create-workspace.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createWorkspace } from '@/models/workspace/workspace.api';
import { WORKSPACES_QUERY_KEY } from './use-workspaces';

export function useCreateWorkspace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createWorkspace,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WORKSPACES_QUERY_KEY });
    },
  });
}
```

**Auth hook:**

```typescript
// hooks/use-auth.ts
import { useQuery } from '@tanstack/react-query';
import { fetchCurrentUser } from '@/models/auth/auth.api';

export const AUTH_QUERY_KEY = ['auth', 'me'] as const;

export function useAuth(): AuthState {
  const { data, isLoading, error } = useQuery({
    queryKey: AUTH_QUERY_KEY,
    queryFn: fetchCurrentUser,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });

  return {
    user: data ?? null,
    isAuthenticated: data !== null && data !== undefined,
    isLoading,
    error: error instanceof Error ? error : null,
  };
}
```

**Key patterns:**

- Export query keys as constants for cache invalidation
- Configure `staleTime` to reduce unnecessary refetches
- Disable `retry` for auth queries (401 should not retry)
- Always pass `credentials: 'include'` for session cookie support
- Provider setup in `providers/query-provider.tsx`

## Form Handling

Use React Hook Form with Zod for all forms:

```typescript
// Schema - features/settings/schemas/profile-form.schema.ts
import { z } from 'zod';

export const profileFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
});

export type ProfileFormData = z.infer<typeof profileFormSchema>;

// Component - features/settings/components/profile-form.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

export function ProfileForm({ defaultValues, onSubmit }: Props) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name')} aria-invalid={!!errors.name} />
      {errors.name && <p role="alert">{errors.name.message}</p>}
    </form>
  );
}
```

## Adding New Features

### Step 1: Create Feature Folder

```bash
mkdir -p src/features/workspace/{components,hooks,schemas,types}
```

### Step 2: Create Entity (if new business object)

```typescript
// models/workspace/workspace.schema.ts
import { z } from 'zod';

export const workspaceSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  ownerId: z.string().uuid(),
});

export type Workspace = z.infer<typeof workspaceSchema>;
export type CreateWorkspaceInput = Pick<Workspace, 'name'>;
```

```typescript
// models/workspace/workspace.api.ts
import { env } from '@/config/env';
import type { Workspace, CreateWorkspaceInput } from './workspace.schema';

const BASE_URL = `${env.NEXT_PUBLIC_API_URL}/workspaces`;

export async function fetchWorkspaces(): Promise<Workspace[]> {
  const response = await fetch(BASE_URL, { credentials: 'include' });
  if (!response.ok) throw new Error('Failed to fetch workspaces');
  return response.json();
}

export async function fetchWorkspace(id: string): Promise<Workspace> {
  const response = await fetch(`${BASE_URL}/${id}`, { credentials: 'include' });
  if (!response.ok) throw new Error('Failed to fetch workspace');
  return response.json();
}

export async function createWorkspace(data: CreateWorkspaceInput): Promise<Workspace> {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create workspace');
  return response.json();
}

export async function updateWorkspace(id: string, data: Partial<Workspace>): Promise<Workspace> {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'PATCH',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update workspace');
  return response.json();
}

export async function deleteWorkspace(id: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to delete workspace');
}
```

### Step 3: Create Feature Hooks

```typescript
// features/workspace/hooks/use-workspaces.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchWorkspaces, createWorkspace } from '@/models/workspace/workspace.api';

export const WORKSPACES_QUERY_KEY = ['workspaces'] as const;

export function useWorkspaces() {
  const { data, isLoading, error } = useQuery({
    queryKey: WORKSPACES_QUERY_KEY,
    queryFn: fetchWorkspaces,
  });
  return { workspaces: data ?? [], isLoading, error };
}

export function useCreateWorkspace() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createWorkspace,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WORKSPACES_QUERY_KEY });
    },
  });
}
```

### Step 4: Create Feature Components

```typescript
// features/workspace/components/workspace-card.tsx
interface WorkspaceCardProps {
  workspace: Workspace;
}

export function WorkspaceCard({ workspace }: WorkspaceCardProps) {
  return (
    <div className="rounded-lg border p-4">
      <h3 className="font-medium">{workspace.name}</h3>
    </div>
  );
}
```

### Step 5: Create Feature Page

```typescript
// features/workspace/workspace-list-page.tsx
'use client';

import { useWorkspaces } from './hooks/use-workspaces';
import { WorkspaceCard } from './components/workspace-card';
import { WorkspaceListSkeleton } from './components/workspace-list-skeleton';

export function WorkspaceListPage() {
  const { workspaces, isLoading } = useWorkspaces();

  if (isLoading) return <WorkspaceListSkeleton />;

  return (
    <div className="grid gap-4">
      {workspaces.map((workspace) => (
        <WorkspaceCard key={workspace.id} workspace={workspace} />
      ))}
    </div>
  );
}
```

### Step 6: Wire Up in App Router

```typescript
// app/(dashboard)/workspaces/page.tsx
import { Suspense } from 'react';
import { WorkspaceListPage } from '@/features/workspace/workspace-list-page';
import { WorkspaceListSkeleton } from '@/features/workspace/components/workspace-list-skeleton';

export const metadata = { title: 'Workspaces' };

export default function Page() {
  return (
    <Suspense fallback={<WorkspaceListSkeleton />}>
      <WorkspaceListPage />
    </Suspense>
  );
}
```

### Step 7: Add Tests

```typescript
// features/workspace/components/workspace-card.spec.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { WorkspaceCard } from './workspace-card';

describe('WorkspaceCard', () => {
  it('should display workspace name', () => {
    render(<WorkspaceCard workspace={{ id: '1', name: 'My Workspace', ownerId: '2' }} />);
    expect(screen.getByText('My Workspace')).toBeInTheDocument();
  });
});
```

## Testing

### Test Structure

- **Unit tests:** Co-located with source files (`.spec.ts` / `.spec.tsx`)
- **E2E tests:** In `e2e/` folder (`.e2e-spec.ts`)

### Test Patterns

```typescript
// Component test
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

describe('ProfileForm', () => {
  it('should call onSubmit with form data', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();

    render(<ProfileForm defaultValues={mockValues} onSubmit={handleSubmit} />);

    await user.click(screen.getByRole('button', { name: /save/i }));

    expect(handleSubmit).toHaveBeenCalledWith(mockValues);
  });
});

// Hook test with TanStack Query mock
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi } from 'vitest';
import * as workspaceApi from '@/models/workspace/workspace.api';

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe('useWorkspaces', () => {
  it('should return workspace data', async () => {
    vi.spyOn(workspaceApi, 'fetchWorkspaces').mockResolvedValue([mockWorkspace]);

    const { result } = renderHook(() => useWorkspaces(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.workspaces).toEqual([mockWorkspace]);
  });
});
```

### Coverage Requirements

| Metric         | Threshold |
| -------------- | --------- |
| Lines          | 80%       |
| Functions      | 80%       |
| Branches       | 80%       |
| Statements     | 80%       |
| Mutation Score | 80%       |

## Naming Conventions

| Element    | Convention             | Example                 |
| ---------- | ---------------------- | ----------------------- |
| Files      | `kebab-case`           | `user-profile-card.tsx` |
| Components | `PascalCase`           | `UserProfileCard`       |
| Hooks      | `camelCase` with `use` | `useCurrentUser`        |
| Hook files | `use-kebab-case.ts`    | `use-current-user.ts`   |
| Schemas    | `camelCase` + Schema   | `profileFormSchema`     |
| Query keys | `SCREAMING_SNAKE`      | `WORKSPACES_QUERY_KEY`  |
| Types      | `PascalCase`           | `UserProfile`           |
| Constants  | `SCREAMING_SNAKE`      | `MAX_FILE_SIZE`         |
| Handlers   | `handle` prefix        | `handleSubmit`          |

## Import Conventions

### Path Aliases

Use `@/` for all absolute imports:

```typescript
import { Button } from '@/components/ui/button';
import { useCurrentUser } from '@/hooks/use-current-user';
import { userSchema } from '@/models/user/user.schema';
```

### Import Order

```typescript
// 1. React and external libraries
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

// 2. Internal - models
import { fetchWorkspaces } from '@/models/workspace/workspace.api';

// 3. Internal - shared
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

// 4. Relative imports
import { ProfileFormFields } from './components/profile-form-fields';

// 5. Types
import type { ProfileFormData } from './types/settings.types';
```

### No Barrel Exports

Import directly from files, not index files:

```typescript
// Correct
import { Button } from '@/components/ui/button';

// Incorrect
import { Button } from '@/components/ui';
```

## Error Handling

### Error Strategy

| Error            | Handling               |
| ---------------- | ---------------------- |
| Validation (400) | Inline form errors     |
| Auth (401)       | Redirect to login      |
| Forbidden (403)  | Toast + redirect       |
| Not Found (404)  | `not-found.tsx`        |
| Server (500)     | Toast + log to Datadog |
| Network          | Toast with retry       |

### API Error Hook

```typescript
const { handleError } = useApiErrorHandler();

try {
  await mutate(data);
} catch (error) {
  handleError(error);
}
```

### API Function Error Pattern

All API functions in `models/` must throw meaningful errors:

```typescript
export async function fetchWorkspace(id: string): Promise<Workspace> {
  const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/workspaces/${id}`, {
    credentials: 'include',
  });

  if (response.status === 404) throw new Error('Workspace not found');
  if (response.status === 401) throw new Error('Unauthorized');
  if (!response.ok) throw new Error(`Request failed: ${response.status}`);

  return response.json();
}
```

## Environment Variables

### Centralized Configuration

All environment variables are validated with Zod at startup in `src/config/env.ts`:

```typescript
// src/config/env.ts
import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url().default('http://localhost:3003'),
  NEXT_PUBLIC_DATADOG_APPLICATION_ID: z.string().optional(),
  NEXT_PUBLIC_DATADOG_CLIENT_TOKEN: z.string().optional(),
  NEXT_PUBLIC_DATADOG_SITE: z.string().optional(),
  NEXT_PUBLIC_DATADOG_SERVICE: z.string().optional(),
  NEXT_PUBLIC_DATADOG_ENV: z.string().optional(),
  NEXT_PUBLIC_ENV: z.enum(['development', 'staging', 'production']).default('development'),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
});

export type Env = z.infer<typeof envSchema>;
export const env = validateEnv();
```

**Usage:**

```typescript
// Import the validated config
import { env } from '@/config/env';

// Use with full type safety
const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/workspaces`);
```

**Benefits:**

- Fails fast on startup if required variables are missing or invalid
- Full type safety and IDE autocomplete
- No more `|| 'default'` scattered throughout the codebase
- Single source of truth for all configuration

### Available Variables

| Variable                             | Description                            | Required                     |
| ------------------------------------ | -------------------------------------- | ---------------------------- |
| `NEXT_PUBLIC_API_URL`                | REST API base URL                      | No (default: localhost:3003) |
| `NEXT_PUBLIC_DATADOG_APPLICATION_ID` | Datadog application ID                 | No                           |
| `NEXT_PUBLIC_DATADOG_CLIENT_TOKEN`   | Datadog client token                   | No                           |
| `NEXT_PUBLIC_DATADOG_SITE`           | Datadog site (e.g., us5.datadoghq.com) | No                           |
| `NEXT_PUBLIC_DATADOG_SERVICE`        | Service name for Datadog               | No                           |
| `NEXT_PUBLIC_DATADOG_ENV`            | Environment name for Datadog           | No                           |
| `NEXT_PUBLIC_ENV`                    | Environment (dev/staging/prod)         | No (default: development)    |

## Important Notes

### Do Not

- Use default exports (except for pages)
- Import from other features
- Add `'use client'` unnecessarily
- Use `any` type
- Use barrel exports (index.ts)
- Skip tests for new code
- Commit console.log statements
- Fetch data directly in components — always go through a model API function

### Always

- Co-locate tests with source files
- Use Zod for validation
- Use TanStack Query for all server data
- Add Suspense boundaries at page level
- Handle loading and error states
- Follow naming conventions
- Write accessible components (WCAG AA)
- Export query keys as named constants
- Pass `credentials: 'include'` on all fetch calls

## Third-Party Integrations

### TanStack Query (REST API)

- Client setup: `src/lib/query/client.ts`
- Provider: `src/providers/query-provider.tsx`
- Used for all server data fetching and mutations
- See `src/hooks/use-auth.ts` for usage example

### Authentication (Backend-Handled)

- Auth is managed by the Rails API via REST endpoints
- Endpoints: `/api/auth/me`, `/api/auth/login`, `/api/auth/logout`, `/api/auth/callback`
- Model: `src/models/auth/` (schema + API)
- Hook: `src/hooks/use-auth.ts`
- Components: `src/features/auth/components/`
- Route protection: `src/proxy.ts`

### Route Protection (Next.js Proxy)

Next.js 16 renamed `middleware.ts` to `proxy.ts`. Use `proxy.ts` for route protection:

```typescript
// src/proxy.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function proxy(request: NextRequest): Promise<NextResponse> {
  // Validate session with API
  const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
    headers: { cookie: request.headers.get('cookie') || '' },
  });

  if (!response.ok) {
    return NextResponse.redirect(`${env.NEXT_PUBLIC_API_URL}/api/auth/login`);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
```

**Key points:**

- Use `proxy.ts` (not `middleware.ts`) - the middleware convention is deprecated in Next.js 16
- Function must be named `proxy()` (not `middleware()`)
- Use for routing, redirects, and auth checks only - not complex business logic
- Fail secure: redirect to login on any error

### Feature Flags (Backend-Handled)

- Feature toggles are managed by the API via REST
- Hook: `src/hooks/use-feature-flag.ts`

## Quick Reference

### Creating a New Feature

1. Create folder: `src/features/[name]/`
2. Add components, hooks, schemas, types
3. Create entity schema and API functions if new business object
4. Wire up in `app/` router
5. Add tests

### Feature Checklist

- [ ] Feature folder created
- [ ] Components have tests
- [ ] Hooks have tests
- [ ] API functions live in `models/[entity]/[entity].api.ts`
- [ ] Query keys exported as constants
- [ ] Forms use React Hook Form + Zod
- [ ] Loading states handled
- [ ] Error states handled
- [ ] Accessible (labels, ARIA)
- [ ] No imports from other features

## Git

### Branches

`feat/`, `fix/`, `hotfix/`, `refactor/`, `docs/`, `chore/` — optionally with ticket: `feat/REP-123-description`

### Commits (Conventional Commits)

`type(scope): TICKET-N - subject` — e.g. `feat(auth): REP-123 - add session expiration`

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `perf`, `ci`

### PRs

- Descriptive title in conventional commit format
- Link issues with `Closes #N`
- No commented-out code, no `console.log`, no secrets
- At least one approval required, all CI green before merge

## Language

- Code (variables, functions, classes): **English**
- Commits and PRs: **English**
