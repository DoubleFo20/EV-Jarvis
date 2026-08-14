# EV-JARVIS Frontend

Next.js App Router frontend for the approved Sprint 1 SSR authentication scope.

## Security boundaries

- Browser code receives only the Supabase project URL and publishable key.
- The service-role key is not used by this application and must never be placed in a `NEXT_PUBLIC_*` variable.
- Protected pages validate signed claims on the server. Cookie refresh is handled by `src/proxy.ts` and auth responses are marked private/no-store.
- Redirect destinations are restricted to local paths.
- Profile reads use the signed-in user's Supabase session and database RLS.
- Provider error details are mapped to stable public messages rather than rendered directly.

## Database contract

This milestone does not add or apply a database migration. It reuses the reviewed `public.user_profiles` table, trigger, grants, and owner/admin RLS policies in:

`../backend/prisma/migrations/20260807000100_auth_profile_foundation/migration.sql`

The migration must only be deployed to EV-JARVIS-DEV under the separately approved database process.

## Local configuration

Copy `.env.example` to a local ignored environment file and set only EV-JARVIS-DEV values. Never commit the resulting file.

## Verification

Run `npm run typecheck`, `npm run lint`, `npm test`, and `npm run build`.
