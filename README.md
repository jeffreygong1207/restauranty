# Restauranty

Restaurant-controlled no-show prevention, verified waitlist recovery, and auditable agent orchestration — built on Next.js 16, MongoDB Atlas, Auth0, and the Google Places API v1.

## Problem

Restaurants lose revenue when high-demand tables become no-shows too late to refill. Diners need responsible ways to cancel or release tables, and restaurants need controls that prevent scalping, hoarding, and bot-driven abuse.

## What Restauranty does

1. Restaurant managers search Google Places, claim or register their venue, set a reservation policy, and land on a per-restaurant operator dashboard.
2. Diners sign in, see their reservations, confirm or release in one tap, and join verified waitlists when the place they want is full.
3. Deterministic agents score risk, enforce policy, contact diners, rank verified waitlist candidates, and record every action to an audit log.

## Not reservation scalping

Restauranty is not a resale marketplace. Paid resale is disabled by default, restaurant approval is required by default, replacement diners are human-verified by default, recovery is policy-governed, and every important action is audit-logged.

## Product surface

### Restaurant manager
- `/restaurants/search` — Google Places live search (text query + location).
- `/restaurants/claim/[placeId]` — claim a Google Places listing, prefilled with phone/website/photo.
- `/restaurants/new` — register a venue manually if it isn't on Google.
- `/restaurant-dashboard` — router that handles 0/1/many owned restaurants.
- `/restaurants/[id]/dashboard` — per-restaurant operator console with metrics, today's reservations, waitlist preview, audit log, and quick actions.
- `/policies`, `/agents`, `/admin`, `/integrations` — policy editor, agent room, audit/admin trust pages.

### Diner
- `/home` — diner home with upcoming reservations, trust score, and waitlist activity.
- `/my-reservations` and `/my-reservations/[id]` — list and detail with confirm / release actions.
- `/waitlist/join` — join a verified waitlist for a restaurant + time window.
- `/profile` — manage role, view diner profile, and sign out.

### Marketing
- `/` — landing page that surfaces real risk metrics from the operator data.

## Architecture

- Next.js 16 App Router with React 19 and TypeScript (strict).
- MongoDB Atlas primary persistence with seeded demo fallback when env vars are missing.
- Cookie-based session over Auth0 OIDC Authorization Code flow; demo session fallback if Auth0 is not configured.
- Google Places API v1 (`places:searchText` + `places/{id}`) with `X-Goog-FieldMask` headers.
- Route handlers for restaurants, claims, places search/details, reservations, waitlist, policies, recovery, World ID, Twilio, Agentverse, ElevenLabs, Cloudinary.
- Deterministic agents in `lib/agents` (Risk, Policy, Confirmation, Waitlist, Fairness, Restaurant, Settlement, Explanation).
- Design tokens and components in `components/restauranty-core.tsx`, derived from the canonical Claude Design files in `restauranty design/`.

## Database collections

`users`, `restaurants`, `restaurantClaims`, `restaurantPolicies`, `diners`, `reservations`, `waitlistCandidates`, `recoveryRequests`, `agentRuns`, `agentLogs`, `auditLogs`, `externalIntegrations`, `sponsorEvents`, `notificationEvents`, `importedRestaurantSources`.

## Auth & roles

Roles: `restaurant_manager`, `diner`, `replacement_diner`, `admin`. The `/onboarding` page lets a signed-in user pick a role; the role drives the default landing page and the navigation.

If `AUTH0_DOMAIN`, `AUTH0_CLIENT_ID`, `AUTH0_CLIENT_SECRET`, `AUTH0_SECRET`, and `APP_BASE_URL` are set, `/api/auth/login` initiates an Auth0 Authorization Code flow and `/api/auth/callback` exchanges the code, fetches the userinfo, and creates or links the user. Otherwise `/api/auth/demo-login` issues a cookie-backed demo session for the requested role so the app stays fully functional in local dev.

## Real APIs

- **Google Places** — text search and place details run server-side when `GOOGLE_MAPS_API_KEY` is present and `ENABLE_GOOGLE_PLACES=true`. `getPlaceDetails(placeId)` is used by the claim flow to prefill phone, website, photo, and business status.
- **MongoDB Atlas** — used whenever `MONGODB_URI` and `MONGODB_DB` are configured. All repositories transparently fall back to seeded data otherwise.
- **Auth0** — full OIDC code flow when configured.
- **Twilio, World ID, Agentverse, ElevenLabs, Cloudinary** — activate only when configured; otherwise the app runs in safe demo mode.

## Fallback behavior

Missing credentials never crash the app. Google Places falls back to seeded restaurants, Twilio creates simulated notification events, World ID allows demo-only simulated verification, Auth0 falls back to demo session login, Agentverse stays in local mode, and explanations use deterministic templates.

## Environment

Copy `.env.example` and fill credentials as available. Server secrets are read only in server code. Client code uses only `NEXT_PUBLIC_*` variables.

```bash
npm install
npm run validate-env   # prints integration matrix
npm run db:seed        # seeds Atlas if configured, no-op otherwise
npm run dev
```

Open `http://localhost:3000`.

## Testing

```bash
npm run lint
npm run typecheck
npm run smoke
npm run build
```

`npm run smoke` validates env loading, MongoDB connectivity (when configured), seed insert, **live Google Places search for "Katsuya West Hollywood"**, place details retrieval, reservation loading, risk scoring, policy enforcement, waitlist ranking, fairness blocking, recovery request creation, audit log writes, sponsor event writes, and a full `next build`.

## Deployment

Deploy to a Node-compatible Next.js host such as Vercel or Vultr. Configure production environment variables, enable the Google Places API in your GCP project, provision MongoDB Atlas, set `APP_BASE_URL`, and optionally configure Auth0, World ID, Twilio, Agentverse, ElevenLabs, Cloudinary, and LLM providers.

## Demo script

See [docs/DEMO_SCRIPT.md](docs/DEMO_SCRIPT.md).

## Design process

See [docs/DESIGN_PROCESS.md](docs/DESIGN_PROCESS.md). The implementation imports the canonical `restauranty design/styles.css` and ports every page-level Claude Design reference into App Router routes.

## Sponsor mapping

See [docs/SPONSOR_TRACKS.md](docs/SPONSOR_TRACKS.md). Primary tracks implemented visibly: Fetch.ai Agentverse, MongoDB Atlas, Auth0 OIDC, World ID verification/fallback, Claude Design/Figma Make process, Arista Connect the Dots, and Cognition Augment the Agent.

## Known limitations

- Restaurant claim verification is currently self-attested with admin review — production would require email-domain or phone-OTP verification (the data model already supports `claim_method`).
- Agentverse direct registration depends on an external account and is a manual/sync step.
- LLM explanations are optional and never used for decisions.
- Some CSV import behavior is implemented at API preview level rather than a full spreadsheet UI.

## Partnership requirements

Full production rollout would require restaurant POS / reservation-system partnerships for canonical booking inventory, live table status, official cancellation policies, payment processor fee handling, and host-stand operational workflows.
