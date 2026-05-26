'use client'

import { Trophy, Target, AlertTriangle, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import type { Team, Player, Match } from '@/lib/types'

interface PainelTabProps {
  teams: Team[]
  players: Player[]
  matches: Match[]
}

export function PainelTab({ teams, players, matches }: PainelTabProps) {
  // Sort teams by points (descending), then by goals (descending)
  const sortedTeams = [...teams].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points
    return b.goals - a.goals
  })

  // Sort players by goals (descending)
  const topScorers = [...players]
    .filter((p) => p.goals > 0 || p.yellowCards > 0 || p.redCards > 0)
    .sort((a, b) => b.goals - a.goals)

  // Get team name helper
  const getTeamName = (teamId: string) => {
    return teams.find((t) => t.id === teamId)?.name || 'Time desconhecido'
  }

  // Get player team name
  const getPlayerTeamName = (teamId: string) => {
    return teams.find((t) => t.id === teamId)?.name || '-'
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <Trophy className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Times</p>
                <p className="text-3xl font-black">{teams.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-secondary flex items-center justify-center">
                <Target className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Jogadores</p>
                <p className="text-3xl font-black">{players.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-secondary flex items-center justify-center">
                <Clock className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Partidas</p>
                <p className="text-3xl font-black">{matches.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-secondary flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Gols</p>
                <p className="text-3xl font-black">
                  {matches.reduce((acc, m) => acc + m.score1 + m.score2, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Standings Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              Tabela de Classificação
            </CardTitle>
          </CardHeader>
          <CardContent>
            {sortedTeams.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead className="text-center">PTS</TableHead>
                    <TableHead className="text-center">Gols</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedTeams.map((team, index) => (
                    <TableRow key={team.id} className={index < 3 ? 'bg-primary/5' : ''}>
                      <TableCell className="font-bold">
                        {index === 0 ? (
                          <span className="text-primary">{index + 1}º</span>
                        ) : (
                          <span>{index + 1}º</span>
                        )}
                      </TableCell>
                      <TableCell className="font-semibold">{team.name}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant={index === 0 ? 'default' : 'secondary'} className="font-bold">
                          {team.points}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center font-medium">{team.goals}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Nenhum time cadastrado ainda
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Scorers Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Artilharia
            </CardTitle>
          </CardHeader>
          <CardContent>
            {topScorers.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>Jogador</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead className="text-center">Gols</TableHead>
                    <TableHead className="text-center">
                      <span className="text-warning">CA</span>
                    </TableHead>
                    <TableHead className="text-center">
                      <span className="text-destructive">CV</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topScorers.map((player, index) => (
                    <TableRow key={player.id} className={index < 3 ? 'bg-primary/5' : ''}>
                      <TableCell className="font-bold">
                        {index === 0 ? (
                          <span className="text-primary">{index + 1}º</span>
                        ) : (
                          <span>{index + 1}º</span>
                        )}
                      </TableCell>
                      <TableCell className="font-semibold">{player.name}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {getPlayerTeamName(player.teamId)}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={index === 0 ? 'default' : 'secondary'} className="font-bold">
                          {player.goals}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        {player.yellowCards > 0 && (
                          <Badge variant="outline" className="bg-warning/10 text-warning border-warning/30">
                            {player.yellowCards}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {player.redCards > 0 && (
                          <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/30">
                            {player.redCards}
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Nenhuma estatística registrada ainda
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Match History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Histórico de Partidas
          </CardTitle>
        </CardHeader>
        <CardContent>
          {matches.length > 0 ? (
            <div className="space-y-3">
              {matches.map((match) => (
                <div
                  key={match.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 border border-border/50"
                >
                  <div className="flex-1 text-right">
                    <span className="font-semibold">{getTeamName(match.team1Id)}</span>
                  </div>
                  <div className="px-6">
                    <div className="flex items-center gap-3 bg-card px-4 py-2 rounded-lg border border-border">
                      <span className="text-2xl font-black text-primary">{match.score1}</span>
                      <span className="text-muted-foreground font-medium">x</span>
                      <span className="text-2xl font-black text-primary">{match.score2}</span>
                    </div>
                  </div>
                  <div className="flex-1 text-left">
                    <span className="font-semibold">{getTeamName(match.team2Id)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Nenhuma partida registrada ainda
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
