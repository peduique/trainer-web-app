# Trainer Portal (Web)

Next.js 16 web application for Element26's Trainer Portal. Feature-complete parity with the React Native mobile app (element26-app).

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env.local
# Configure API_BASE_URL, STRIPE_PUBLIC_KEY, etc.

# Development
npm run dev
# Open http://localhost:3000

# Build & production
npm run build
npm start

# Testing
npm run test        # Run unit tests
npm run test:e2e    # Run Playwright E2E tests
npm run test:coverage # Coverage report
```

## 📋 Prerequisites

- **Node.js** 20+
- **pnpm**, **npm**, or **yarn**
- **.env.local** with required variables (see .env.example)

**Backend API:** Expects same API as element26-app (see [API_ROUTES.md](./API_ROUTES.md))

## 🏗️ Architecture

### Feature-Based Structure

```
src/
├── app/                    # Next.js 16 App Router
│   ├── (auth)/            # Authentication layout (login, signup, forgot password)
│   ├── (dashboard)/       # Protected dashboard layout (sidebar, header)
│   │   ├── programs/      # List, create, detail
│   │   ├── history/       # Workout history calendar
│   │   ├── profile/       # User profile management
│   │   ├── settings/      # Preferences
│   │   ├── subscription/  # Subscription management
│   │   └── support/       # Support tickets (Asana)
│   └── layout.tsx         # Root layout with providers
│
├── components/
│   ├── ui/                # Reusable UI components (15+ components)
│   ├── layout/            # Layout components (sidebar, header, etc.)
│   └── providers/         # TanStack Query provider
│
├── features/              # Feature-specific logic
│   ├── auth/              # Login, signup, password reset
│   ├── programs/          # Program management
│   ├── program-days/      # Day details, exercises, workouts
│   ├── exercises/         # Exercise detail, history, scores
│   ├── history/           # History calendar, workouts
│   ├── profile/           # Profile editing, avatar
│   ├── settings/          # User settings
│   ├── subscriptions/     # Subscription UI
│   ├── support/           # Support tickets
│   └── professional-profile/  # Trainer profiles
│
├── models/                # API contracts & types
│   ├── auth/              # Auth schemas & API functions
│   ├── programs/          # Program schemas & API functions
│   ├── workouts/          # Workout schemas & API functions
│   ├── exercises/         # Exercise schemas & API functions
│   ├── history/           # History schemas & API functions
│   ├── profile/           # Profile schemas & API functions
│   ├── scores/            # Score schemas & API functions
│   ├── subscriptions/     # Subscription schemas & API functions
│   ├── professional-profile/  # Professional profile
│   └── support/           # Support (Asana integration)
│
├── lib/
│   ├── api/
│   │   └── client.ts      # Fetch wrapper with error handling
│   ├── query/
│   │   └── client.ts      # TanStack Query client factory
│   ├── auth-token.ts      # Token storage & management
│   └── utils.ts           # Utility functions
│
├── hooks/
│   ├── use-auth.ts        # Auth context hook
│   ├── use-debounce.ts    # Debounce hook
│   ├── use-countdown.ts   # Countdown timer
│   ├── use-local-storage.ts # Local storage
│   └── use-media-query.ts # Media query
│
└── config/
    └── env.ts            # Zod-validated environment variables
```

### Key Design Patterns

1. **Separation of Concerns**: Features contain hooks, components; models contain schemas & API calls
2. **Type Safety**: Zod schemas validate API responses and form inputs
3. **Named Exports Only**: No barrel exports (`.../index.ts`), no default exports except pages/layouts
4. **kebab-case files, PascalCase components**: Consistent naming
5. **'use client' Directive**: Only added when hooks/events are needed (RSC by default)
6. **Async Params**: Next.js 15+ pages receive `params: Promise<{...}>` requiring `await params`

## 📡 API Integration

### Routes

All routes are **identical to mobile app**. See [API_ROUTES.md](./API_ROUTES.md) for full list.

**Base URL**: `process.env.NEXT_PUBLIC_API_BASE_URL` (default: `http://localhost:3001`)

**No `/api/` prefix** — routes start with `/` directly:
```
POST /auth/login
GET /programs
POST /programs/{id}/add_workout_to_day
PUT /workouts_exercises/{id}/finish_async
```

### API Client

Thin fetch wrapper at `src/lib/api/client.ts`:
```typescript
// All methods throw ApiClientError on non-2xx
apiClient.get<T>(url, params?)
apiClient.post<T>(url, body)
apiClient.patch<T>(url, body)
apiClient.put<T>(url, body)
apiClient.delete<T>(url, body?)
apiClient.upload<T>(url, formData)
```

### TanStack Query v5

All server state managed by TanStack Query with:
- Query keys as constants (not inline)
- Cache invalidation on mutations
- Optimistic updates where appropriate
- Type-safe hooks per feature

Example:
```typescript
// src/models/programs/programs.api.ts — data fetching
export async function fetchPrograms(): Promise<Program[]> {
  return apiClient.get<Program[]>('/programs');
}

// src/features/programs/hooks/use-programs.ts — TanStack Query
export function usePrograms() {
  return useQuery({
    queryKey: PROGRAM_QUERY_KEYS.lists(),
    queryFn: fetchPrograms,
  });
}
```

## 🔐 Authentication

- **Routes Protected by**: `src/proxy.ts` with `proxy()` function
- **Public Routes**: `/auth/*` (login, signup, forgot password)
- **Protected Routes**: `/` redirects to `/programs` or `/login`
- **Token Storage**: localStorage + HTTP-only cookie (HttpOnly, Secure, SameSite)

## 🎨 UI Components

15 reusable components in `src/components/ui/`:
- Input, Select, Textarea, Checkbox, Radio Group
- Modal, Tabs, Card, Badge, Spinner, Avatar
- Toast (with `ToastProvider`/`useToast`)
- Empty State, Pagination, File Upload

Styled with **Tailwind CSS**. See components for usage.

## 📝 Forms

**React Hook Form + Zod** for all forms:
```typescript
// Schema in models
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

// Component
export function LoginForm() {
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });
  // ...
}
```

## 🧪 Testing

### Unit Tests (Vitest)

```bash
npm run test                 # Run all tests
npm run test:watch         # Watch mode
npm run test:coverage      # Generate coverage
```

Configuration in `vitest.config.ts`:
- JSdom environment
- Coverage thresholds: 80% (lines, functions, branches, statements)
- Excludes: `**/node_modules/**`, `**/e2e/**`

### E2E Tests (Playwright)

```bash
npm run test:e2e            # Run E2E tests
npm run test:e2e:ui        # UI mode
npm run test:e2e:debug     # Debug mode
```

Configuration in `playwright.config.ts`:
- Configured for localhost:3000
- Screenshots/videos on failure
- 30s timeout per test

## 🚀 Deployment

### Vercel (Recommended)

```bash
git push origin main
# Auto-deploys via Vercel GitHub integration
```

Environment variables on Vercel dashboard (Settings → Environment Variables):
- `NEXT_PUBLIC_API_BASE_URL`
- `NEXT_PUBLIC_STRIPE_PUBLIC_KEY`
- `NEXT_PUBLIC_TRIAGE_FUNCTION_URL` (Support)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Support)

### Docker

```bash
docker build -t trainer-portal .
docker run -p 3000:3000 -e NEXT_PUBLIC_API_BASE_URL=... trainer-portal
```

See `Dockerfile` for production image.

## 📚 Key Features

### Authentication
- Email/password login, signup
- Password reset via email
- Change password
- Delete account
- Session persistence

### Programs
- List, create (AI + manual), detail
- Week/day tabs
- Reorder weeks/days
- Add/remove workouts
- Delete programs

### Workouts & Exercises
- Add exercises to workouts
- Reorder exercises
- Complete/undo exercises with progress tracking
- Exercise history with metrics
- Rest timer between sets

### History
- Calendar view of completed workouts
- Workout details per day

### Profile & Settings
- Avatar upload
- Update personal info
- Change password
- Delete account
- Preferences & notifications

### Subscriptions
- View current plan
- Compare plans
- Stripe checkout
- Cancel/reactivate

### Support
- Create support tickets (integrates with Asana)
- Upload screenshots
- Automatic triage & duplicate detection
- View ticket history

### Professional Profiles
- View trainer profiles
- Portfolio items

## 🔧 Development

### Environment Variables

See `.env.example`:
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=...
NEXT_PUBLIC_TRIAGE_FUNCTION_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

### Add a New Feature

1. **Create models** (`src/models/feature/`):
   - `feature.schema.ts` — Zod schemas
   - `feature.api.ts` — API functions

2. **Create feature hooks** (`src/features/feature/hooks/`):
   - `use-feature.ts` — TanStack Query hooks

3. **Create components** (`src/features/feature/components/`):
   - Feature-specific components

4. **Add pages** (`src/app/(dashboard)/feature/`):
   - Route handlers, pages

5. **Add UI components as needed** (reuse from `src/components/ui/`)

### Code Style

- **ESLint** for linting
- **Prettier** for formatting
- **TypeScript** in strict mode
- **No console** in production (handled by server-side only)

```bash
npm run lint                # Run ESLint
npm run format              # Format with Prettier
npx tsc --noEmit           # Type check
```

## 🐛 Troubleshooting

### "Cannot find module '@/...'"

Check `tsconfig.json` path aliases — should have `@` mapping to `src/`.

### API 401/403 errors

Verify token is stored correctly:
- Check `localStorage` for `auth_token`
- Check HTTP-only cookie in dev tools
- Verify `NEXT_PUBLIC_API_BASE_URL` matches backend

### Tests fail with "Cannot find canvas"

Run with: `npm run test` (Vitest handles jsdom setup)

### Playwright E2E fails

Ensure dev server is running:
```bash
npm run dev &
npm run test:e2e
```

## 📦 Dependencies

### Core
- **Next.js 16** — React framework
- **React 19** — UI library
- **TypeScript** — Type safety

### Data & Forms
- **TanStack Query v5** — Server state
- **React Hook Form** — Form management
- **Zod** — Schema validation

### UI
- **Tailwind CSS** — Styling
- **Radix UI** — Unstyled components (used in custom components)
- **Lucide React** — Icons
- **react-hot-toast** — Toast notifications

### API
- **Fetch API** — HTTP client (built-in)
- **Stripe.js** — Payment processing

### Testing
- **Vitest** — Unit tests
- **Playwright** — E2E tests
- **@testing-library/react** — Component testing

### Development
- **ESLint** — Linting
- **Prettier** — Code formatting
- **tsx** — TypeScript executor

## 📄 License

Proprietary — Element26

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feat/my-feature`
2. Implement feature following [architecture](#-architecture)
3. Write tests (or defer if user explicitly allows)
4. Submit PR with description of changes

## 📞 Support

For issues or questions, reach out to the team or create a support ticket via the in-app Support feature.
