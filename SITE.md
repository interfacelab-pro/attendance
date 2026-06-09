# QaY Framework

> Pakistan's stock market, explained simply.

## About

QaY Framework is a stock market analysis web application built by **Ahmed Qayyum**. It helps everyday Pakistanis — including first-time investors — understand the Pakistan Stock Exchange (PSX) and make smarter investment decisions. All analysis is written in plain English with technical terms explained in brackets.

## Brand Identity

- **Personality:** Friendly, honest, knowledgeable — like a friend who understands investing
- **Colors:** Deep navy blue (#0b1120) primary background, gold/amber (#d4a017) accent, clean white text
- **Fonts:** Space Grotesk (headings), DM Sans (body text)
- **Theme:** Dark mode by default (easier to read financial data)
- **Color coding:** Green = positive/buy, Red = sell/negative, Yellow/Orange = caution, Blue = hold, Grey = neutral

## Pages

- **Homepage** (`/`) — Hero section with stock search bar, live KSE-100 ticker, 3-pillar framework explanation, Ideal Portfolio preview, call-to-action
- **Ideal Portfolio** (`/ideal-portfolio`) — Pre-built list of 10 top PSX companies (one per sector), daily brief at top, company cards with signal + health score + summary. Publicly accessible, no login required.
- **Single Stock Analysis** (`/analysis/[TICKER]`) — Full QaY Framework 3-pillar report: Company Health (score 0-100), Price Signal (BUY/HOLD/SELL/AVOID), Bigger Picture (oil, budget, rates, rupee, global events). Includes Bottom Line and What to Watch sections.
- **Dashboard** (`/dashboard`) — Logged-in users' custom portfolio. Add/remove stocks, see analysis cards, weekly report summary. Free tier shows weekly refresh notice.
- **Login** (`/login`) — Email + password login with Google OAuth option
- **Register** (`/register`) — Free account creation with name, email, password
- **Pricing** (`/pricing`) — Two tiers: Free (weekly analysis, 5 stocks, 1 search/day) and Pro Rs. 999/month (daily analysis, unlimited stocks, unlimited searches, personalized brief)

## Components

- **Navbar** — Sticky top navigation with QaY logo, links (Home, Ideal Portfolio, Pricing), Log In and Sign Up buttons. Mobile hamburger menu.
- **Footer** — Brand info, product links, account links, disclaimer about educational purposes.

## The QaY Framework (3 Pillars)

1. **Company Health (Fundamentals)** — Is the company making money? Looks at quarterly results, 12-month trend, 3-year trend, vs competitors. Health Score 0-100.
2. **Price Signal (Technical)** — Is now the right time? Analyzes price movement, volume, moving averages, RSI. Signal: BUY / WEAK BUY / HOLD / WEAK HOLD / SELL / AVOID / NEUTRAL.
3. **Bigger Picture (Story & Outlook)** — What external factors matter? Oil prices, government budget, SBP interest rates, PKR/USD, global events, company news. Verdict: Positive / Mixed / Negative Outlook.

## Ideal Portfolio Companies

| Sector | Company | Ticker |
|--------|---------|--------|
| Oil & Gas Exploration | Mari Petroleum | MARI |
| Refinery | Attock Refinery | ATRL |
| Fertilizer | Fauji Fertilizer | FFC |
| Cement | Lucky Cement | LUCK |
| Textile / Apparel | Interloop | ILP |
| Automobile | Sazgar Engineering | SAZE |
| Power Generation | Hub Power | HUBC |
| Commercial Banks | United Bank Limited | UBL |
| Technology | Systems Limited | SYS |
| Food & Consumer | Nestle Pakistan | NESTLE |

## Data Sources

- PSX Data Portal: https://dps.psx.com.pk (company pages, market summary, sector summary, announcements, payouts)
- Macro data: Web search for oil prices, SBP rate, PKR/USD, budget news
- LLM: OpenCode Go for generating plain-English analysis

## Tech Stack

- Next.js 16 (App Router)
- React 19
- Tailwind CSS 4
- TypeScript
- Framer Motion (animations)
- Lucide React (icons)
- Supabase (authentication + database)
- OpenCode Go (LLM analysis engine)

## Authentication

- Supabase Auth with email/password and Google OAuth
- Session management via middleware (auto-refresh)
- Protected routes: `/dashboard`
- Auth callback: `/auth/callback` for OAuth redirect

## Database (Supabase)

Tables needed:
- `portfolio_stocks` — user_id, ticker, created_at

## API Routes

- `/api/psx?ticker=[TICKER]` — Fetches company data from PSX Data Portal
- `/api/analysis` — POST endpoint that sends PSX data + macro context to OpenCode Go for analysis generation

## Environment Variables

- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` — Supabase anon key
- `OPENCODE_API_KEY` — OpenCode Go API key for LLM analysis
- `OPENCODE_API_BASE` — OpenCode Go API base URL (default: https://api.opencode.ai/v1)

## Current Status

- MVP frontend is built with all pages and components
- Mock data is being used for development (real PSX data fetching via API routes is set up)
- LLM integration is configured but requires ANTHROPIC_API_KEY environment variable
- User authentication UI is built (backend auth logic needed)
- Dark mode is the default theme

## How to Customize

- **To change colors:** Edit CSS variables in `app/globals.css` (look for `:root` section)
- **To change brand fonts:** Edit font imports in `app/layout.tsx`
- **To add a company to Ideal Portfolio:** Edit `IDEAL_PORTFOLIO_TICKERS` in `lib/mock-data.ts`
- **To update company names/sectors:** Edit `COMPANY_NAMES` and `SECTOR_MAP` in `lib/mock-data.ts`
- **To connect real PSX data:** Set up the API routes (already scaffolded in `app/api/`)
- **To enable LLM analysis:** Add `ANTHROPIC_API_KEY` to your environment variables

## Recent Changes

- June 9, 2026: Added Supabase authentication (email/password + Google OAuth)
- June 9, 2026: Integrated OpenCode Go as LLM analysis engine (replacing Anthropic)
- June 9, 2026: Created middleware for session refresh
- June 9, 2026: Navbar now shows user email and sign out when logged in
- June 9, 2026: Dashboard connected to Supabase for portfolio storage
- June 9, 2026: Initial build — all MVP pages created (Homepage, Ideal Portfolio, Analysis, Dashboard, Login, Register, Pricing)
- June 9, 2026: Dark mode theme with navy/gold branding applied
- June 9, 2026: Mock data system created for development
- June 9, 2026: API routes scaffolded for PSX data fetching and LLM analysis
