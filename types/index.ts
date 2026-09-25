export interface Player {
  id: string;
  name: string;
  totalScore: number;
  roundScores: number[];
}

export interface Team {
  id: string;
  name: string;
  players: [string, string]; // two partner names
  totalScore: number;
  roundScores: number[];
}

export interface GameSession {
  id: string;
  date: string;
  players: Player[]; // in partner mode, this holds the 2 teams as Player objects (id, name, totalScore, roundScores) for backwards compatibility
  teams?: Team[]; // partner mode structured teams with [partner1, partner2]
  winnerId?: string | null;
  loserId?: string | null;
  status: 'active' | 'completed';
  targetScore?: number;
  title?: string;
  mode?: 'solo' | 'partner' | 'target-win' | 'lowest-pip'; // solo or partner
  currentRound?: number;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PlayerStats {
  name: string;
  gamesPlayed: number;
  gamesWon: number;
  gamesLost: number;
  totalPoints: number;
  winRate: number;
  avgScore: number;
  highestRound: number;
}
