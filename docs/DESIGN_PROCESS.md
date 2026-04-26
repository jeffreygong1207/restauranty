# Design Process

Claude Design files in `restauranty design/` were treated as the visual source of truth. The implementation imports the canonical `styles.css` directly from `app/globals.css` and ports the app shell, page order, cards, badges, metrics, recovery flow, waitlist candidates, agent cards, and diner rescue flow into Next.js App Router components.

| Design file | Implemented route or component |
| --- | --- |
| `Restauranty.html` | Reference shell and asset load order |
| `styles.css` | Imported by `app/globals.css` |
| `app.jsx` | `components/app-shell.tsx`, route layout |
| `core.jsx` | `components/restauranty-core.tsx` |
| `page-landing.jsx` | `/` |
| `page-overview.jsx` | `/dashboard` |
| `page-detail.jsx` | `/reservations/[id]` |
| `page-recovery.jsx` | `/recovery/[id]` |
| `page-waitlist.jsx` | `/waitlist` |
| `page-policies.jsx` | `/policies` |
| `page-agents.jsx` | `/agents` |
| `page-diner.jsx` | `/diner` |
| `page-trust.jsx` | `/trust` and `/admin` |
| `tweaks-panel.jsx` | Not shipped as a floating edit panel; the editable policy controls are implemented as product UI. |

Deviation: the original design was a single in-browser React prototype. The port splits it into database-backed Next.js routes and replaces static interactions with API-backed actions where practical.
