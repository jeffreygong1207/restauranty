# Sponsor Track Mapping

## Fetch.ai Agentverse
Restauranty defines a Recovery Agent with a local Chat Protocol-compatible endpoint at `/api/agentverse/chat`. It answers manager intents about high-risk reservations, risk reasons, recommended action, best replacement diner, and whether recovery is policy-allowed. `scripts/register-agentverse.ts` emits the manifest and records sync attempts.

## MongoDB Atlas
MongoDB is the primary production store when `MONGODB_URI` and `MONGODB_DB` are configured. Collections include restaurants, policies, diners, reservations, waitlist candidates, recovery requests, agent runs/logs, audit logs, sponsor events, notifications, integrations, users, and imported restaurant sources.

## Auth0 Agents
When Auth0 credentials exist, the app is ready to map Auth0 identity and roles. When missing, the UI shows demo auth mode through a role switcher with `restaurant_manager`, `diner`, `replacement_diner`, and `admin`.

## World ID
`/api/worldid/verify` verifies a World ID proof when credentials exist and supports clearly labeled demo verification when missing. Replacement diners are downgraded or blocked by policy when human verification is required.

## Figma Make / Claude Design
The `restauranty design/` files drive the visual system, layout, and page structure. `docs/DESIGN_PROCESS.md` maps every design file to the implementation.

## Arista Connect the Dots
Restauranty connects public restaurant data, restaurant policies, diners, verified waitlists, SMS confirmations, agents, manager approvals, and audit logs into one logistics workflow.

## Cognition Augment the Agent
The agent layer is augmented with deterministic business logic, audit logs, integration health checks, smoke tests, agent run traces, manager approval gates, and verification layers.

## Optional Tracks
ElevenLabs is available at `/api/elevenlabs/voice-summary` when enabled. Cloudinary signatures are available at `/api/cloudinary/signature`. Gemma/OpenAI/Anthropic can generate explanations only; no LLM decides risk, policy, ranking, approval, or fees. Vultr and GoDaddy are deployment/domain follow-ups.
