# Z Record System 🎲

> **"Never lose track of a point again."**

**Z Record System** is a modern, fast, mobile-friendly score tracker and match recorder engineered for Dominoes games (and point accumulation games). Designed specifically for table play on mobile phones or tablets, with zero-latency input, real-time live cards, round-by-round mistake recovery, and 100% client-side persistence in `localStorage`.

---

## 🏆 Core Game Rule (100-Bust Rule)

1. **Point Accumulation**: Players add points each round based on pips caught in opponents' hands.
2. **The Loser**: The first player or team whose accumulated total reaches or crosses **100 points** (or the custom target score) is marked as the **LOSER**, and the match concludes immediately.
3. **The Winner**: Among the remaining players, the player or team with the **LOWEST total accumulated score is crowned the WINNER**!
4. **Instant Match Results**: Upon match completion, a final results screen celebrates the winner, records the loser, sorts final standings from lowest to highest score, and stores the game into Match History.

---

## 🚀 Key Features

- **Side-by-Side Player Cards**: Beautiful responsive cards for 2 to 6 players/teams with large total scores and progress bars toward the 100-point bust.
- **Real-Time Score Entry & Pip Shortcuts**: Direct number input on each card plus quick-pip buttons (`+5`, `+10`, `+20`, `+30`).
- **Input Validation**: Strict validation ensures scores are positive whole numbers (`> 0`) and blocks invalid/empty submissions.
- **Mistake Recovery (Undo & Edit)**:
  - **Undo Last Score**: Remove the most recent round score with one tap.
  - **Tap-to-Edit Any Round**: Tap any past round score in a player's history to update or delete it with automatic total recalculation.
- **Match History Archive (`/history`)**: Browse all past matches sorted most recent first, with winner/loser tags, final scores, search, and full round-by-round inspection modal.
- **JSON Backup & Restore**: Export and import full game logs for backups or cross-device transfer.
- **Dark & Light Mode**: Auto-detects system preferences with a manual toggle in the header.
- **Zero-Config Vercel Deployable**: 100% client-side `localStorage` persistence with no server-only dependencies or external database required.

---

## 📁 Project Structure

```text
├── app/
│   ├── layout.tsx         # RootLayout with branding, metadata, and footer
│   ├── page.tsx           # Home scoreboard page
│   └── history/
│       └── page.tsx       # Dedicated /history route
├── components/
│   ├── ZLogo.tsx          # Minimalist geometric "Z" monogram logo
│   ├── Header.tsx         # Header with Z branding, tagline, tabs, & dark mode toggle
│   ├── PlayerCard.tsx     # Player card with large score, bust meter, undo & tap-to-edit
│   ├── ScoreInput.tsx     # Number input with positive validation and quick pip presets
│   ├── ActiveGame.tsx     # Live scoreboard and full round matrix table
│   ├── NewGameScreen.tsx  # Setup screen for 2 to 6 players and custom target score
│   ├── GameResultsModal.tsx # Winner/Loser announcement and sorted standings modal
│   ├── MatchDetailsModal.tsx # Full round-by-round log viewer for past matches
│   ├── GameHistory.tsx    # Searchable match history with most-recent-first sorting
│   ├── Leaderboard.tsx    # Hall of fame rankings, win rates, and round high-scores
│   └── DominoRuleGuide.tsx # Domino rules breakdown & interactive pip hand calculator
├── lib/
│   ├── game.ts            # Core game logic, 100-bust outcome evaluation, round mutations
│   ├── storage.ts         # Safe localStorage persistence layer with seed demo games
│   └── theme.tsx          # Dark/Light theme provider with system auto-detection
└── types/
    └── index.ts           # TypeScript interfaces: Player, GameSession, PlayerStats
```

---

## 🛠️ Local Development Setup

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or pnpm or yarn

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-username/z-record-system.git
cd z-record-system
npm install
```

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

This application is built with pure client-side React/TypeScript and `localStorage`, requiring **no database, no environment variables, and zero configuration**.

### Method 1: Deploy with Vercel CLI
```bash
# 1. Install Vercel CLI (if not already installed)
npm install -g vercel

# 2. Login to your Vercel account
vercel login

# 3. Deploy
vercel
```
Accept default settings (`Vite` or `Next.js`), and Vercel will build and deploy the app in seconds.

### Method 2: Deploy via Vercel Web Dashboard (Git)
1. Push your repository to **GitHub**, **GitLab**, or **Bitbucket**.
2. Go to [vercel.com](https://vercel.com) and log in.
3. Click **"Add New..."** → **"Project"**.
4. Select your `z-record-system` repository.
5. Keep all default build settings:
   - **Framework Preset**: Auto-detected (`Vite` or `Other`)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Click **"Deploy"**.

Your app is now live with an HTTPS URL and ready for phone score tracking during Dominoes games!

---

## 📄 License
MIT License. Created for the **Z Record System**.
