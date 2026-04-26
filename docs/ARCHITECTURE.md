# Architecture

Restauranty is a Next.js App Router application with server-rendered operational pages, route handlers, MongoDB Atlas persistence, deterministic agent logic, and graceful credential fallbacks.

Core layers:

- `app/`: pages and API route handlers.
- `components/`: Claude Design-derived UI primitives and client controls.
- `lib/repositories/`: MongoDB-backed repositories with seeded in-memory fallback.
- `lib/agents/`: deterministic risk, policy, waitlist, fairness, confirmation, approval, settlement, explanation, and recovery orchestration.
- `lib/services/`: Google Places, Twilio, World ID, Agentverse, ElevenLabs, Cloudinary, and LLM adapters.
- `scripts/`: seed, smoke test, env validation, and Agentverse registration helper.

Important mutations write audit logs and sponsor events where relevant. LLMs can explain outcomes but never decide risk, policy, ranking, approval, or settlement.
