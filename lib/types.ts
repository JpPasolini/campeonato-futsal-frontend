export interface Championship {
  id: string
  name: string
  createdAt: string
}

export interface Team {
  id: string
  name: string
  coach: string
  championshipId: string
  points: number
  goals: number
}

export interface Player {
  id: string
  name: string
  teamId: string
  championshipId: string
  shirtNumber: number
  goals: number
  yellowCards: number
  redCards: number
}

export interface PlayerStats {
  playerId: string
  playerName: string
  goals: number
  yellowCards: number
  redCards: number
}

export interface Match {
  id: string
  championshipId: string
  team1Id: string
  team2Id: string
  score1: number
  score2: number
  playerStats: PlayerStats[]
}
