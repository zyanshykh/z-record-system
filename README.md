# Z Record System 🎲

> **"Never lose track of a point again."**

**Z Record System** is a modern, fast, mobile-friendly score tracker and match recorder engineered for Dominoes games (and point accumulation games). Built with **Next.js 14 (App Router)**, **TypeScript**, and **Tailwind CSS**, designed specifically for table play on mobile phones or tablets, with zero-latency input, real-time live cards, round-by-round mistake recovery, and 100% client-side persistence in `localStorage`.

---

## 🏆 Core Game Rule (100-Bust Rule)

1. **Point Accumulation**: Players add points each round based on pips caught in opponents' hands.
2. **The Loser**: The first player or team whose accumulated total reaches or crosses **100 points** (or the custom target score) is marked as the **LOSER**, and the match concludes immediately.
3. **The Winner**: Among the remaining players, the player or team with the **LOWEST total accumulated score is crowned the WINNER**!
4. **Instant Match Results**: Upon match completion, a final results screen celebrates the winner, records the loser, sorts final standings from lowest to highest score, and stores the game into Match History.

---

## 🚀 Key Features

- **Next.js 14 App Router**: Modern server/client architecture with clean routing (`/`, `/new-game`, and `/history`).
- **Partner Mode (2 vs 2 Doubles)**:
  - 2 Teams with 2 named partners each (e.g. Team A = Player1 + Player2, Team B = Player3 + Player4).
  - Team-level combined scoring: each round, select which team boarded points (losing side of hand); the other team is automatically awarded 0 for that round.
  - Side-by-side round history showing the exact alternating zero-and-board pattern.
- **Solo Mode (2 to 6 Players)**: Classic individual free-for-all scoring with custom player names and separate score tracking.
- **Side-by-Side Live Cards**: Responsive grid for teams/players with large bold total scores, bust meters, and scrollable round histories.
- **Strict Real-Time Match History**: 0% dummy/demo data. Clean start for every new user; history populates only with games actually played and saved.
- **Mistake Recovery (Undo & Edit)**:
  - **Undo Round / Undo Last Score**: Revert the previous round or score with one tap.
  - **Tap-to-Edit Any Round**: Tap any past round row to update points or delete.
- **Match History Archive (`/history`)**: Browse past Solo and Partner matches sorted most recent first, with winner/loser badges, search, filter, and complete round-by-round inspections.
- **JSON Backup & Restore**: Export and import full game logs for backups or cross-device transfer.
- **Zero-Config Vercel Deployable**: 100% client-side `localStorage` persistence with no server-only dependencies or external database required. Clean `npm install` without `--force` or `--legacy-peer-deps`.

---

## 📁 Project Structure

```text
├── app/
│   ├── globals.css        # Tailwind directives and CSS variables
│   ├── layout.tsx         # Next.js 14 RootLayout with branding, metadata & viewport
│   ├── page.tsx           # Home scoreboard page
│   ├── new-game/
│   │   └── page.tsx       # Dedicated /new-game route for session setup
│   └── history/
│       └── page.tsx       # Dedicated /history route
├── components/
│   ├── ZLogo.tsx          # Minimalist geometric "Z" monogram logo
│   ├── Header.tsx         # Header with Z branding, tagline, tabs, & dark mode toggle
│   ├── PlayerCard.tsx     # Player card with large score, bust meter, undo & tap-to-edit
│   ├── ScoreInput.tsx     # Number input with positive validation and quick pip presets
│   ├── NewGameForm.tsx    # Modular player setup form (2-6 players, custom target score)
│   ├── NewGameScreen.tsx  # Setup screen wrapper with rules summary
│   ├── NewGameModal.tsx   # Modal wrapper for quick session creation
│   ├── ActiveGame.tsx     # Live scoreboard and full round matrix table
│   ├── PartnerScorePanel.tsx # 2v2 partner scoring control with auto-0 pair
│   ├── EditRoundModal.tsx # Comprehensive mistake-recovery modal (edit score, switch boarding team, delete round)
│   ├── GameResultsModal.tsx # Winner/Loser announcement and sorted standings modal
│   ├── MatchDetailsModal.tsx # Full round-by-round log viewer for past matches
│   ├── GameHistory.tsx    # Searchable match history with most-recent-first sorting
│   ├── Leaderboard.tsx    # Hall of fame rankings, win rates, and round high-scores
│   ├── DominoRuleGuide.tsx # Domino rules breakdown & interactive pip hand calculator
│   └── ZRecordApp.tsx     # Core interactive application state orchestrator
├── lib/
│   ├── game.ts            # Core game logic, 100-bust outcome evaluation, round mutations
│   ├── storage.ts         # Safe localStorage persistence layer with seed demo games
│   └── theme.tsx          # Dark/Light theme provider with system auto-detection
├── types/
│   └── index.ts           # TypeScript interfaces: Player, GameSession, PlayerStats
├── next.config.mjs        # Next.js 14 configuration
├── tailwind.config.ts     # Tailwind CSS configuration
└── postcss.config.mjs     # PostCSS configuration
```

---

## 🛠️ Local Development Setup

### Prerequisites
- Node.js (v18.17+ or v20+ recommended)
- npm, pnpm, or yarn

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-username/z-record-system.git
cd z-record-system
npm install
```
*(Notice: installs smoothly with standard `npm install` with zero peer dependency conflicts!)*

### 2. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Verify Build & Lint
```bash
npm run lint
npm run build
```

---

## ☁️ Deploy to Vercel (Zero-Config)

This application is built with pure client-side Next.js 14 and `localStorage`, requiring **no database, no environment variables, and zero configuration**.

### Method 1: Deploy via Vercel Web Dashboard (Recommended)
1. Push this repository to **GitHub**, **GitLab**, or **Bitbucket**.
2. Go to [vercel.com](https://vercel.com) and log in.
3. Click **"Add New..."** → **"Project"**.
4. Select your `z-record-system` repository.
5. Vercel automatically detects:
   - **Framework Preset**: `Next.js`
   - **Root Directory**: `./`
   - **Build Command**: `next build`
   - **Output Directory**: `.next`
6. Click **"Deploy"**.

### Method 2: Deploy with Vercel CLI
```bash
# 1. Install Vercel CLI globally
npm install -g vercel

# 2. Login to your Vercel account
vercel login

# 3. Deploy
vercel
```

Your app is immediately live with an HTTPS URL, fully responsive on mobile devices, and ready for table Dominoes score tracking!

---

## ☁️ Optional: Cloud Sync with Supabase (accounts + database)

By default matches live only in the browser's `localStorage`. To keep them in a database, available on any device after signing in, connect a free [Supabase](https://supabase.com) project. Without these steps the app still works in local-only mode.

1. Create a project at supabase.com.
2. Open **SQL Editor**, paste the contents of [`supabase/schema.sql`](supabase/schema.sql) and run it. This creates the `game_sessions` table where each user can only access their own rows.
3. Open **Project Settings → API** and copy the **Project URL** and the **anon / publishable key**.
4. Add them as environment variables (locally in `.env.local`, on Vercel under **Settings → Environment Variables**), then redeploy:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   ```
5. In Supabase **Authentication → URL Configuration**, set **Site URL** to your deployed app URL (and add it to Redirect URLs) so confirmation emails and Google sign-in return to the app.
6. *(Optional)* For "Continue with Google", enable the Google provider under **Authentication → Providers**.

How it works: the app stays local-first (instant, works offline). When signed in, every change is also saved to Supabase, and both sides are merged on sign-in (the newest copy of each match wins). Matches already saved in the browser as a guest are added to the account on first sign-in. Signing out removes the account's matches from that browser (they stay in the cloud).

---

## 📄 License
MIT License. Created for the **Z Record System**.
