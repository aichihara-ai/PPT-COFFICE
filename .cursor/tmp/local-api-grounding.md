# Grounding: demo vs API mode

## What exists

Office Hub has two persistence backends behind one client helper.

`isApiMode` in `src/shared/config/app-config.ts` is true only when `NEXT_PUBLIC_USE_API === "true"` or `NEXT_PUBLIC_VERCEL_ENV` is `production` or `preview`. Local `npm run dev` is demo unless the flag is set.

`.env.local` already has a Neon `DATABASE_URL` (host `*.neon.tech`, db `neondb`) plus JWT/setup/admin keys. Both `NEXT_PUBLIC_USE_API` and leftover `VITE_USE_API` are `false`.

`apiFetch` in `src/shared/api/client.ts` short-circuits to `demoApiFetch` when `!isApiMode`. Demo state is `localStorage` key `office-hub-demo` in `src/shared/lib/demo-store.ts`. Real mode `fetch`es `/api/*` with `credentials: "include"`. Route handlers in `src/_app/api-routes/` use Prisma + Neon (`src/shared/db/index.server.ts`).

Auth is also dual-path. Demo seeds `DEFAULT_DEMO_USER` and skips login (`ProtectedLayout` returns children when `!isApiMode`). API mode uses `/api/auth/me` + httpOnly `office-hub-token`. Demo-only UI: "Continue in demo mode" on login, Team/HR switch in `SidebarAccountMenu`.

`verify-office-hub` launches `npm run build && npm start` without setting the flag, so it verifies demo. API mode is documented as a shared Neon sandbox.

PR #9 (`fix/next-public-use-api`) already forced Vercel prod/preview onto API mode. Local default was left as demo.

## Constraint from the user

Local should hit the local Next.js `/api/*` and the Neon already in `.env.local`. Demo is not wanted.

## Domain shape

The domain is one persistence mode, not two.

```
type Persistence = { kind: "api" }
```

A boolean `isApiMode` plus a second in-browser store is the accidental shape. Callers should not branch on mode.

## Call sites that still branch

- `src/shared/api/client.ts`
- `src/features/auth/ui/auth-provider.tsx`
- `src/_pages/login/ui/login-page.tsx`
- `src/widgets/app-shell/ui/protected-layout.tsx`
- `src/widgets/app-shell/ui/SidebarAccountMenu.tsx`
- `src/widgets/app-shell/ui/app-shell-layout.tsx`
- `.env.example`, `README.md`, `.cursor/skills/verify-office-hub/**`

Unrelated dirty files on main (kitchen wishlist, suggestion hooks) stay out of this change.

## Tests

No unit tests import `demo-store`. Booking/restaurant title tests are independent.
