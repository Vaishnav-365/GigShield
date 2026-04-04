# GigShield AI — Frontend (Person 5)

Next.js 14 (App Router) + TypeScript + Tailwind CSS

## Setup

```bash
cd gigshield-frontend
npm install
npm run dev
```

Open http://localhost:3000

## Environment

Create `.env.local` (already included):
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/register` | 3-step worker registration |
| `/login` | Sign in (has demo buttons for judges) |
| `/dashboard` | Worker dashboard — policy, triggers, claims |
| `/plans` | Plan selection with AI premium breakdown |
| `/claims` | Claim tracker with status tabs |
| `/admin` | Admin dashboard — triggers, claims review, analytics |

## Mock Data

All pages fall back to realistic mock data when the backend is unavailable, so the UI is always fully functional for demo purposes.

## Key Components

- `components/NavBar.tsx` — sticky nav with auth-aware links
- `components/PlanCard.tsx` — plan display with activate button
- `components/ClaimTracker.tsx` — claim list with trust scores and status
- `components/TriggerBadge.tsx` — trigger display with severity indicators

## API Integration

All API calls are centralised in `lib/api.ts`.
Auth token is managed in `lib/auth.ts` via localStorage.

## Demo Credentials (for judges)

After the backend is running with seed data:
- Worker: `worker@demo.com` / `demo123`
- Admin: `admin@demo.com` / `demo123`
