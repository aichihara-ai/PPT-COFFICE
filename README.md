# Office Hub

Internal office tools for the Vancouver team. Built with `@ppt/luminis`, deployed on Vercel with Neon Postgres.

## Features

- **Meeting rooms** — book Maple or Cedar room, see live busy/free status
- **Kitchen snacks** — suggest items; HR admin marks bought/declined
- **Coffee & milk** — team updates inventory levels
- **Office lunch** — restaurant pool, one-step vote (up to 3 picks), single winner

## Stack

- Next.js 16 App Router + React + TypeScript + Tailwind v4
- `@ppt/luminis` vendored in `vendor/luminis` (no private npm feed required for deploy)
- Prisma 7 + Neon Postgres (`@prisma/adapter-neon`)
- Feature-Sliced Design under `src/`

## Database migrations (baseline)

`prisma/migrations/0_init` uses `CREATE TABLE IF NOT EXISTS` to match the existing Neon schema. On a database that already has these tables, mark the migration as applied instead of re-running DDL:

```bash
npx prisma migrate resolve --applied 0_init
npm run db:migrate
```

Fresh databases can run `npm run db:migrate` directly. After migration, `/api/setup` creates the inventory rows and admin account. The lunch restaurant pool starts empty — teammates add Uber Eats links themselves. The endpoint does not modify the schema.

## Local setup

1. **Install dependencies**

   ```bash
   cd PPTVCOFFICE
   npm install
   ```

   `@ppt/luminis` is bundled under `vendor/luminis`. To refresh from a local design-system checkout:

   ```bash
   npm run sync:luminis
   ```

2. **Environment** — copy `.env.example` to `.env.local`:

   ```
   DATABASE_URL=postgresql://...
   JWT_SECRET=your-long-random-secret
   SETUP_SECRET=one-time-setup-secret
   ADMIN_NAME=HR Admin
   ADMIN_PASSWORD=replace-before-deploying
   ```

3. **Initialize database**

   Apply the Prisma migrations first:

   ```bash
   npm run db:migrate
   ```

   Then seed the database and create the admin account:

   ```bash
   curl -X POST http://localhost:3000/api/setup \
     -H "x-setup-secret: your-setup-secret"
   ```

4. **Run**

   ```bash
   npm run dev
   ```

   Sign in with the admin account from `/api/setup`, or register a new user.

## Deploy to Vercel

1. Push this repo to **private GitHub**
2. Import project in Vercel
3. Add Neon via Vercel Marketplace (sets `DATABASE_URL`)
4. Set env vars: `JWT_SECRET`, `SETUP_SECRET`, `ADMIN_NAME`, `ADMIN_PASSWORD`
5. On an existing Neon database, baseline once: `npx prisma migrate resolve --applied 0_init`
6. Run `npm run db:migrate` against the production database
7. Deploy. Hit `/api/setup` only if you need to seed or reset the admin password
8. Log in as HR admin and use the app

## Admin (HR)

The seeded admin account (`ADMIN_NAME` / `ADMIN_PASSWORD`) can:

- Mark snack suggestions bought/declined
- Close lunch rounds and announce winners
- Cancel any meeting room booking

Regular users register once and stay logged in via an httpOnly `office-hub-token` cookie.
