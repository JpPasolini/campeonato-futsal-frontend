import type { Championship, Team, Player, Match, PlayerStats } from './types'

const API_BASE = 'https://campeonato-futsal-api.onrender.com/api'

async function fetcher<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) throw new Error('Erro ao buscar dados')
  return res.json()
}

export async function getChampionships(): Promise<Championship[]> {
  return fetcher<Championship[]>(`${API_BASE}/championships`)
}

export async function createChampionship(name: string): Promise<Championship> {
  const res = await fetch(`${API_BASE}/championships`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  })
  if (!res.ok) throw new Error('Erro ao criar campeonato')
  return res.json()
}

export async function getTeams(championshipId: string): Promise<Team[]> {
  return fetcher<Team[]>(`${API_BASE}/teams?championshipId=${championshipId}`)
}

export async function createTeam(data: { name: string; coach: string; championshipId: string }): Promise<Team> {
  const res = await fetch(`${API_BASE}/teams`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Erro ao criar time')
  return res.json()
}

export async function getPlayers(championshipId: string): Promise<Player[]> {
  return fetcher<Player[]>(`${API_BASE}/players?championshipId=${championshipId}`)
}

export async function createPlayer(data: {
  name: string
  teamId: string
  shirtNumber: number
  championshipId: string
}): Promise<Player> {
  const res = await fetch(`${API_BASE}/players`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Erro ao criar jogador')
  return res.json()
}

export async function getMatches(championshipId: string): Promise<Match[]> {
  return fetcher<Match[]>(`${API_BASE}/matches?championshipId=${championshipId}`)
}

export async function createMatch(data: {
  championshipId: string
  team1Id: string
  team2Id: string
  score1: number
  score2: number
  playerStats: PlayerStats[]
}): Promise<Match> {
  const res = await fetch(`${API_BASE}/matches`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Erro ao registrar partida')
  return res.json()
}

export const swrKeys = {
  championships: `${API_BASE}/championships`,
  teams: (championshipId: string) => `${API_BASE}/teams?championshipId=${championshipId}`,
  players: (championshipId: string) => `${API_BASE}/players?championshipId=${championshipId}`,
  matches: (championshipId: string) => `${API_BASE}/matches?championshipId=${championshipId}`,
}