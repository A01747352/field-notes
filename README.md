# Field Notes

> A quiet record of the places you go, the things you notice, and the days you want to remember.

Field Notes is a personal archive, not a social network. No feed, no likes, no streaks —
just a fast way to keep a note, a photo, a place, and a moment worth keeping. See
[`docs/design.md`](docs/design.md) for the full product and design spec.

## Stack

- **React + TypeScript + Vite** — app shell and build tooling
- **Tailwind CSS** — styling, on top of a strict black & white design system
- **Supabase** — Postgres database, auth, and photo storage
- **TanStack Query** — data fetching/caching against Supabase
- **React Router** — routing
- **node-vibrant** — dominant color extraction from photos/album art (dynamic accent system)
- **Mapbox** — reverse geocoding and, later, the map view
- **OpenWeatherMap** — auto-filled weather context on new notes

## Getting started

```bash
npm install
cp .env.example .env   # fill in your own keys
npm run dev
```

### Database (Supabase)

The schema lives as SQL migrations in `supabase/migrations/`, not clicked together
in a dashboard. To work on it locally (needs [Docker](https://docs.docker.com/get-docker/)):

```bash
npm run db:start   # boots local Postgres + Supabase stack, applies migrations
npm run db:stop    # shuts it down
```

`db:start` prints a local `API_URL` and `anon key` — put those in `.env` as
`VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` to develop against the local database
instead of a hosted project. Studio (a GUI for the local DB) is at
`http://127.0.0.1:54323`.

To change the schema: add a new file with `npx supabase migration new <name>`, write
plain SQL, then `npm run db:reset` to rebuild the local database from all migrations
and confirm it applies cleanly. Never hand-edit an already-committed migration —
add a new one. `npm run db:types` regenerates `src/types/database.ts` from the local
schema after a migration.

## Scripts

| Command                | Does                                                  |
| ---------------------- | ----------------------------------------------------- |
| `npm run dev`          | Start the local dev server                            |
| `npm run build`        | Type-check and build for production                   |
| `npm run lint`         | Lint with oxlint                                      |
| `npm run format`       | Format the codebase with Prettier                     |
| `npm run format:check` | Check formatting without writing                      |
| `npm run preview`      | Preview the production build locally                  |
| `npm run db:start`     | Start the local Supabase stack                        |
| `npm run db:stop`      | Stop the local Supabase stack                         |
| `npm run db:reset`     | Rebuild the local database from `supabase/migrations` |
| `npm run db:types`     | Regenerate `src/types/database.ts` from the schema    |

## Project structure

```
src/
├── components/   # reusable UI components
├── pages/        # route-level screens
├── lib/          # external clients (supabase, spotify, weather, mapbox)
├── hooks/        # shared React hooks
└── types/        # shared TypeScript types (database.ts is generated, see above)

supabase/
├── config.toml     # local dev stack config
└── migrations/     # SQL schema history, applied in order
```

## Working on this repo

We follow a small GitHub Flow: no direct commits to `main`, one branch per feature/fix/chore,
Conventional Commits, and small focused PRs. Full details in
[`docs/github-workflow.md`](docs/github-workflow.md).

Every PR runs [`.github/workflows/ci.yml`](.github/workflows/ci.yml): format check, lint,
and build, plus a job that boots a fresh local Supabase stack to confirm
`supabase/migrations/` still applies cleanly.
