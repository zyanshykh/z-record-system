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

- **Next.js 14 App Router**: Modern server/client architecture with clean routing (`/` and `/history`).
- **Side-by-Side Player Cards**: Beautiful responsive cards for 2 to 6 players/teams with large total scores and progress bars toward the 100-point bust.
- **Real-Time Score Entry & Pip Shortcuts**: Direct number input on each card plus quick-pip buttons (`+5`, `+10`, `+20`, `+30`).
- **Input Validation**: Strict validation ensures scores are positive whole numbers (`> 0`) and blocks invalid/empty submissions.
- **Mistake Recovery (Undo & Edit)**:
  - **Undo Last Score**: Remove the most recent round score with one tap.
  - **Tap-to-Edit Any Round**: Tap any past round score in a player's history to update or delete it with automatic total recalculation.
- **Match History Archive (`/history`)**: Browse all past matches sorted most recent first, with winner/loser tags, final scores, search, and full round-by-round inspection modal.
- **JSON Backup & Restore**: Export and import full game logs for backups or cross-device transfer.
- **Dark & Light Mode**: Auto-detects system preferences with a manual toggle in the header.
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

## 📄 License
MIT License. Created for the **Z Record System**.
