'use client'

import { useState } from 'react'
import { Loader2, Plus, Trash2, Goal, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { createMatch } from '@/lib/api'
import type { Team, Player, PlayerStats } from '@/lib/types'

interface PartidasTabProps {
  championshipId: string
  teams: Team[]
  players: Player[]
  onMatchCreated: () => void
}

interface PlayerStatEntry extends PlayerStats {
  id: string
}

export function PartidasTab({ championshipId, teams, players, onMatchCreated }: PartidasTabProps) {
  const [team1Id, setTeam1Id] = useState('')
  const [team2Id, setTeam2Id] = useState('')
  const [score1, setScore1] = useState('')
  const [score2, setScore2] = useState('')
  const [playerStats, setPlayerStats] = useState<PlayerStatEntry[]>([])
  const [isCreating, setIsCreating] = useState(false)

  // Players from selected teams
  const team1Players = players.filter((p) => p.teamId === team1Id)
  const team2Players = players.filter((p) => p.teamId === team2Id)
  const availablePlayers = [...team1Players, ...team2Players]

  const handleAddPlayerStat = () => {
    const newStat: PlayerStatEntry = {
      id: crypto.randomUUID(),
      playerId: '',
      playerName: '',
      goals: 0,
      yellowCards: 0,
      redCards: 0,
    }
    setPlayerStats([...playerStats, newStat])
  }

  const handleRemovePlayerStat = (id: string) => {
    setPlayerStats(playerStats.filter((s) => s.id !== id))
  }

  const handlePlayerStatChange = (id: string, field: keyof PlayerStatEntry, value: string | number) => {
    setPlayerStats(
      playerStats.map((s) => {
        if (s.id !== id) return s
        
        if (field === 'playerId') {
          const player = availablePlayers.find((p) => p.id === value)
          return {
            ...s,
            playerId: value as string,
            playerName: player?.name || '',
          }
        }
        
        return { ...s, [field]: value }
      })
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!team1Id || !team2Id || score1 === '' || score2 === '') {
      toast.error('Preencha todos os campos obrigatórios')
      return
    }

    if (team1Id === team2Id) {
      toast.error('Selecione times diferentes')
      return
    }

    setIsCreating(true)
    try {
      await createMatch({
        championshipId,
        team1Id,
        team2Id,
        score1: parseInt(score1),
        score2: parseInt(score2),
        playerStats: playerStats.map(({ playerId, playerName, goals, yellowCards, redCards }) => ({
          playerId,
          playerName,
          goals,
          yellowCards,
          redCards,
        })),
      })
      
      // Reset form
      setTeam1Id('')
      setTeam2Id('')
      setScore1('')
      setScore2('')
      setPlayerStats([])
      
      onMatchCreated()
      toast.success('Partida registrada com sucesso!')
    } catch {
      toast.error('Erro ao registrar partida')
    } finally {
      setIsCreating(false)
    }
  }

  const getTeamName = (teamId: string) => {
    return teams.find((t) => t.id === teamId)?.name || 'Selecione'
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Goal className="h-5 w-5 text-primary" />
            Registrar Nova Partida
          </CardTitle>
          <CardDescription>
            Selecione os times, insira o placar e adicione a súmula com estatísticas dos jogadores
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Teams Selection */}
            <div className="grid gap-6 md:grid-cols-3 items-end">
              <div className="space-y-2">
                <Label>Time Mandante</Label>
                <Select value={team1Id} onValueChange={setTeam1Id}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Selecione o time" />
                  </SelectTrigger>
                  <SelectContent>
                    {teams.map((team) => (
                      <SelectItem key={team.id} value={team.id} disabled={team.id === team2Id}>
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-center block">Placar</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="0"
                    value={score1}
                    onChange={(e) => setScore1(e.target.value)}
                    className="h-12 text-center text-2xl font-bold"
                    placeholder="0"
                  />
                  <span className="text-2xl font-bold text-muted-foreground">x</span>
                  <Input
                    type="number"
                    min="0"
                    value={score2}
                    onChange={(e) => setScore2(e.target.value)}
                    className="h-12 text-center text-2xl font-bold"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Time Visitante</Label>
                <Select value={team2Id} onValueChange={setTeam2Id}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Selecione o time" />
                  </SelectTrigger>
                  <SelectContent>
                    {teams.map((team) => (
                      <SelectItem key={team.id} value={team.id} disabled={team.id === team1Id}>
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Match Preview */}
            {team1Id && team2Id && (
              <div className="flex items-center justify-center p-4 rounded-lg bg-secondary/30 border border-border/50">
                <span className="font-semibold">{getTeamName(team1Id)}</span>
                <span className="mx-4 text-muted-foreground">vs</span>
                <span className="font-semibold">{getTeamName(team2Id)}</span>
              </div>
            )}

            <Separator />

            {/* Player Stats (Súmula) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-warning" />
                    Súmula da Partida
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Adicione gols e cartões para cada jogador
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddPlayerStat}
                  disabled={!team1Id || !team2Id}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Adicionar Jogador
                </Button>
              </div>

              {playerStats.length > 0 ? (
                <div className="space-y-3">
                  {playerStats.map((stat) => (
                    <div
                      key={stat.id}
                      className="flex flex-wrap items-center gap-3 p-4 rounded-lg bg-secondary/20 border border-border/50"
                    >
                      <div className="flex-1 min-w-[200px]">
                        <Select
                          value={stat.playerId}
                          onValueChange={(value) => handlePlayerStatChange(stat.id, 'playerId', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o jogador" />
                          </SelectTrigger>
                          <SelectContent>
                            {availablePlayers.map((player) => (
                              <SelectItem key={player.id} value={player.id}>
                                {player.name} - #{player.shirtNumber}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center gap-2">
                        <Label className="text-sm whitespace-nowrap">Gols:</Label>
                        <Input
                          type="number"
                          min="0"
                          value={stat.goals}
                          onChange={(e) =>
                            handlePlayerStatChange(stat.id, 'goals', parseInt(e.target.value) || 0)
                          }
                          className="w-16 text-center"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-warning/10 text-warning border-warning/30">
                          CA
                        </Badge>
                        <Input
                          type="number"
                          min="0"
                          value={stat.yellowCards}
                          onChange={(e) =>
                            handlePlayerStatChange(stat.id, 'yellowCards', parseInt(e.target.value) || 0)
                          }
                          className="w-16 text-center"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/30">
                          CV
                        </Badge>
                        <Input
                          type="number"
                          min="0"
                          value={stat.redCards}
                          onChange={(e) =>
                            handlePlayerStatChange(stat.id, 'redCards', parseInt(e.target.value) || 0)
                          }
                          className="w-16 text-center"
                        />
                      </div>

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemovePlayerStat(stat.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground border border-dashed border-border rounded-lg">
                  {team1Id && team2Id
                    ? 'Clique em "Adicionar Jogador" para incluir estatísticas na súmula'
                    : 'Selecione os times para adicionar jogadores à súmula'}
                </div>
              )}
            </div>

            <Separator />

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-12 font-bold text-lg"
              disabled={isCreating || !team1Id || !team2Id || score1 === '' || score2 === ''}
            >
              {isCreating ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  Salvando...
                </>
              ) : (
                'Salvar Partida'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
