# Agentverse

Restauranty exposes a local recovery agent:

- Manifest: `GET /api/agentverse/chat`
- Chat: `POST /api/agentverse/chat`
- Sync attempt: `POST /api/agentverse/sync`
- Registration script: `npm run agentverse:register`

Example chat payload:

```json
{
  "message": "Who is the best replacement diner?",
  "reservationId": "res_katsuya_815"
}
```

Supported intents:

- Which reservations are high risk?
- Why is this reservation risky?
- What action should the restaurant take?
- Who is the best replacement diner?
- Can this table be recovered under policy?

Manual registration steps:

1. Create an Agentverse agent named `Restauranty Recovery Agent`.
2. Set the public description to: "Turns restaurant manager intent into risk analysis, policy checking, verified waitlist matching, and manager-approved table recovery."
3. Point webhook or mailbox tooling at `/api/agentverse/chat` on the deployed app.
4. Store credentials in `FETCH_AGENTVERSE_KEY`, `AGENTVERSE_MAILBOX_KEY`, `AGENTVERSE_AGENT_ADDRESS`, and `AGENTVERSE_AGENT_NAME`.
5. Set `ENABLE_AGENTVERSE_SYNC=true` and run `npm run agentverse:register`.

The app never claims registration succeeded unless credentials exist and a sync attempt is recorded.
