# Cloudflare Worker CAT API (Free-tier friendly)

This Worker keeps CAT logic server-side and sends one question at a time.

## Why this architecture

- Full bank stays in GitHub.
- Browser does not load all 3000+ questions.
- CAT state is server-side in KV.
- Cloudflare free tier can run this for early-stage usage.

## Endpoints

- `GET /api/cat/health`
- `POST /api/cat/session`
- `POST /api/cat/session/:id/answer`
- `GET /api/cat/session/:id/state`

## Setup

1. Create a Cloudflare KV namespace called `SESSIONS`.
2. Update `wrangler.toml` with real namespace IDs.
3. Set `BANK_URL` to your public Git-hosted bank JSON URL.
4. Deploy:

```bash
cd cloudflare
npx wrangler deploy
```

## Session creation example

```bash
curl -sX POST https://<your-worker-domain>/api/cat/session \
  -H 'Content-Type: application/json' \
  -d '{"config":{"mode":"cat","startTheta":0}}'
```

## Submit answer example

```bash
curl -sX POST https://<your-worker-domain>/api/cat/session/<sessionId>/answer \
  -H 'Content-Type: application/json' \
  -d '{"questionId":"q-123","selectedIndex":2,"elapsedSec":38}'
```

## Frontend integration notes

- Keep your existing UI.
- Replace local `startNewAttempt` bank init with `POST /api/cat/session`.
- Replace local scoring/next-item selection with `POST /api/cat/session/:id/answer`.
- Render server-returned question and metrics.

## Monetization path later

- Add auth tokens/JWT to API.
- Add per-user quotas.
- Log usage to D1 or external billing backend.
