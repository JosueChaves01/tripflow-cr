# TripFlow CR — Agent Coordination Contract

> **Read this entire file before writing a single line of code.**
> Violations block merges. No exceptions.

---

## Non-negotiable rules for every agent

| Rule | Detail |
|------|--------|
| ❌ NEVER run `npm install` | All dependencies are already installed. |
| ❌ NEVER create folders | All folders already exist (with `.gitkeep`). |
| ❌ NEVER define types | Import everything from `@/types/index.ts`. |
| ❌ NEVER instantiate clients directly | Use the shared lib clients (see below). |
| ✅ ALWAYS use `cn()` | Import from `@/lib/utils` for className merging. |
| ✅ ALWAYS use React Hook Form + Zod | For every form. |
| ✅ ALWAYS use Zustand | For client-side state when needed. |
| ✅ ALWAYS use Server Actions (`actions.ts`) | For all data mutations. |
| ❌ NEVER use `localStorage` for auth tokens | Supabase SSR handles tokens via cookies. |

### Client import rules
```ts
// ✅ Correct
import { createClient } from '@/lib/supabase/client'   // browser components
import { createClient } from '@/lib/supabase/server'   // server components / actions
import { stripe } from '@/lib/stripe/client'
import { openai } from '@/lib/openai/client'
import { cn } from '@/lib/utils'

// ❌ Wrong — NEVER do this
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'
import OpenAI from 'openai'
```

---

## Agent ownership map

| Agent | Feature | Folder ownership |
|-------|---------|-----------------|
| **Agent-AUTH** | F1 Auth + profiles | `features/auth/`, `app/(auth)/` |
| **Agent-ITINERARY** | F2 AI itinerary engine | `features/itinerary/`, `app/(platform)/itinerary/`, `api/itinerary/` |
| **Agent-CATALOG** | F3 Activity catalog | `features/catalog/`, `app/(platform)/dashboard/` |
| **Agent-BOOKINGS** | F4 Booking system | `features/bookings/`, `app/(platform)/booking/`, `api/bookings/` |
| **Agent-PAYMENTS** | F5 Stripe payments | `features/payments/`, `app/(platform)/checkout/`, `api/webhooks/stripe/` |
| **Agent-PROVIDERS** | F6 Provider panel | `features/providers/`, `app/provider/`, `api/providers/` |
| **Agent-UI** | F7 Shared UI primitives | `components/ui/`, `app/layout.tsx` |

> Each agent **only writes** to its owned folders.
> Each agent **may read** from any folder.

---

## Shared state (Zustand — `store/index.ts`)

```ts
// Each agent reads from the store; only its owner agent writes to its slice.
interface TripFlowStore {
  user: UserProfile | null            // owner: Agent-AUTH
  preferences: TravelPreferences | null  // owner: Agent-ITINERARY
  currentItinerary: Itinerary | null     // owner: Agent-ITINERARY
  selectedBookings: Booking[]            // owner: Agent-BOOKINGS
}
```

---

## Integration points — read carefully

```
Agent-AUTH
  └─ produces: UserProfile  →  stored in Zustand, consumed by ALL agents

Agent-CATALOG
  └─ produces: Activity[]  →  consumed by Agent-ITINERARY + Agent-BOOKINGS

Agent-ITINERARY
  ├─ consumes: Activity[] from Agent-CATALOG
  ├─ consumes: UserProfile from Agent-AUTH (via Zustand)
  └─ produces: Itinerary   →  stored in DB + Zustand, consumed by Agent-BOOKINGS

Agent-BOOKINGS
  ├─ consumes: Activity from Agent-CATALOG
  ├─ consumes: Itinerary from Agent-ITINERARY (via Zustand)
  └─ produces: Booking[]   →  stored in DB + Zustand, consumed by Agent-PAYMENTS

Agent-PAYMENTS
  └─ consumes: Booking[] from Agent-BOOKINGS
```

---

## Database schema quick reference

All tables live in `public` schema. Full DDL in `supabase/schema.sql`.

| Table | Owner agent |
|-------|------------|
| `profiles` | Agent-AUTH |
| `providers` | Agent-PROVIDERS |
| `activities` | Agent-CATALOG / Agent-PROVIDERS |
| `itineraries` | Agent-ITINERARY |
| `bookings` | Agent-BOOKINGS |

---

## Environment variables

Never hardcode secrets. Access via `process.env.*` only.

| Variable | Used by |
|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | All agents (browser + server) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | All agents (browser + server) |
| `SUPABASE_SERVICE_ROLE_KEY` | Agent-AUTH (admin operations only) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Agent-PAYMENTS (browser) |
| `STRIPE_SECRET_KEY` | Agent-PAYMENTS (server) |
| `STRIPE_WEBHOOK_SECRET` | Agent-PAYMENTS (webhook verification) |
| `OPENAI_API_KEY` | Agent-ITINERARY |
| `NEXT_PUBLIC_APP_URL` | All agents (absolute URLs) |

---

## Code style

- TypeScript strict mode — zero `any` types
- All components are `'use client'` only if they need browser APIs or hooks
- Prefer Server Components by default
- Zod schemas co-located with their form (`schema.ts` inside the component folder)
- Tailwind classes composed via `cn()` — no inline styles
