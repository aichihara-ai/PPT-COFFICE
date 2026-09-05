# Next.js, Prisma, and Feature-Sliced Design migration

This migration keeps the current Office Hub behavior and moves ownership into domain slices. Next.js owns routing. Feature slices own client-side operations. Prisma owns database access.

## Target structure

The root `app` directory contains only Next.js route files and the root layout. Route files re-export pages and handlers from `src`.

The `src` directory uses these layers:

- `_app` contains providers and Route Handler implementations.
- `_pages` contains the six route-level screens.
- `widgets` contains the app shell and reusable product sections.
- `features` contains authentication, booking, inventory, suggestion, and lunch operations.
- `entities` contains domain types, constants, and pure rules.
- `shared` contains the API client, Prisma adapter, server helpers, generic UI, and generic utilities.

Imports point down the list. Slices on the same layer do not import each other. Each slice exposes an `index.ts`. Server-only exports use `index.server.ts`.

## Domain shape

The client keeps the existing JSON field names. Prisma models use camelCase fields mapped to the existing PostgreSQL tables and columns. The database adapter converts Prisma values to the existing JSON shapes.

The main slices are:

- `entities/user`
- `entities/booking`
- `entities/inventory`
- `entities/suggestion`
- `entities/restaurant`
- `entities/lunch-round`
- `features/auth`
- `features/manage-bookings`
- `features/manage-inventory`
- `features/manage-suggestions`
- `features/manage-lunch`

Pages call feature hooks and compose widgets. Pages do not contain API paths, React Query keys, Prisma imports, or authentication storage code.

## Server boundaries

`app/api/**/route.ts` re-exports functions from `src/_app/api-routes`. Those functions validate requests, authorize users, and call `src/shared/db`.

`src/shared/db` creates one Prisma Client with `@prisma/adapter-neon`. Prisma types stay inside the server boundary.

Authentication uses the existing `office-hub-token` name as an HTTP-only cookie. The browser no longer stores or sends a bearer token. The login and registration responses keep the `token` key with an empty value to avoid exposing the JWT.

## Migration units

1. Add the Next.js, Prisma, and FSD foundation.
2. Move the database adapter and authentication.
3. Move bookings.
4. Move inventory.
5. Move kitchen suggestions.
6. Move restaurants and lunch voting.
7. Move the dashboard, app shell, and demo adapter.
8. Delete the Vite runtime and old API files.

Each unit ends with an architecture check and a focused runtime check. The final check runs `node scripts/verify-migration.mjs` and exercises every page plus the main API paths.

## Deliberate omissions

The design has no `processes` layer, repositories, service classes, or one-file entity slices for lunch child tables. Those layers would add paths without hiding decisions.
