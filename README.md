# JeshVidhi

JeshVidhi is a source-first legal research workspace for Indian lawyers. It includes seeded statutes and judgments so the complete demo works without API credentials.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. Start with onboarding, choose an area of practice, and submit a bail research question.

## Environment variables

Create `.env.local` when connecting live retrieval and an AI-compatible endpoint:

```env
INDIAN_KANOON_API_KEY=
AI_MODEL_ENDPOINT=https://your-api-compatible-endpoint/v1/chat/completions
AI_API_KEY=
```

Live integrations belong in `lib/research.ts`. The seeded data remains the fallback and no answer is returned without source links. API-compatible requests should always use retrieved statute and judgment context in the prompt.

## Research API

`POST /api/research` accepts:

```json
{ "query": "Anticipatory bail under BNSS", "language": "en" }
```

## Seed data

- `data/judgments.json`: 10 sample authorities
- `data/bare-acts.json`: section summaries for the core acts
- `data/scenarios.json`: 5 criminal bail demo scenarios

## Netlify deployment

The repository includes `netlify.toml` and `@netlify/plugin-nextjs`. Add the environment variables in the Netlify site settings, then deploy with:

```bash
npm run build
```

Uploaded documents are stored in browser IndexedDB and remain on the user's device.
