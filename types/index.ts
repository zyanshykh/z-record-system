export interface Player {
  id: string;
  name: string;
  totalScore: number;
  roundScores: number[];
}

export interface GameSession {
  id: string;
  date: string;
  players: Player[];
  winnerId?: string | null;
  loserId?: string | null;
  status: 'active' | 'completed';
  targetScore?: number;
  title?: string;
  mode?: 'target-win' | 'lowest-pip';
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
