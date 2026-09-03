# Office Hub

Internal office tools for the Vancouver team. Built with `@ppt/luminis`, deployed on Vercel with Neon Postgres.

## Features

- **Meeting rooms** — book Maple or Cedar room, see live busy/free status
- **Kitchen snacks** — suggest items; HR admin marks bought/declined
- **Coffee & milk** — team updates inventory levels
- **Office lunch** — restaurant pool, nominate → lock top 3 → vote once

## Stack

- Vite + React + TypeScript + Tailwind v4
- `@ppt/luminis` from the design-system npm feed
- Vercel serverless API routes (`/api/*`)
- Neon Postgres

## Local setup

1. **Install dependencies**

   ```bash
   cd office-hub
   npm install
   ```

   For `@ppt/luminis`, set `NPM_TOKEN` in your environment (see `.npmrc`).  
   For local dev without the feed, point at the monorepo package:

   ```json
   "@ppt/luminis": "file:../design-system/packages/luminis"
   ```

2. **Environment** — copy `.env.example` to `.env.local`:

   ```
   DATABASE_URL=postgresql://...
   JWT_SECRET=your-long-random-secret
   SETUP_SECRET=one-time-setup-secret
   ADMIN_NAME=HR Admin
   ADMIN_PASSWORD=changeme
   ```

3. **Initialize database** — run `db/schema.sql` and `db/seed.sql` in the Neon SQL editor, or:

   ```bash
   curl -X POST http://localhost:3000/api/setup \
     -H "x-setup-secret: your-setup-secret"
   ```

4. **Run**

   ```bash
   npx vercel dev
   ```

   Or frontend only: `npm run dev` (API calls need `vercel dev` or a deployed backend).

## Deploy to Vercel

1. Push this repo to **private GitHub**
2. Import project in Vercel
3. Add Neon via Vercel Marketplace (sets `DATABASE_URL`)
4. Set env vars: `JWT_SECRET`, `SETUP_SECRET`, `ADMIN_NAME`, `ADMIN_PASSWORD`, `NPM_TOKEN`
5. Deploy, then hit `/api/setup` once with the setup secret
6. Log in as HR admin and use the app

## Admin (HR)

The seeded admin account (`ADMIN_NAME` / `ADMIN_PASSWORD`) can:

- Mark snack suggestions bought/declined
- Close lunch rounds and announce winners
- Cancel any meeting room booking

Regular users register once and stay logged in via JWT in localStorage.
