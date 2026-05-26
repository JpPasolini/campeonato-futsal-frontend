'use client'

import { useState } from 'react'
import { Loader2, UserPlus } from 'lucide-react'
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
import { toast } from 'sonner'
import { createPlayer } from '@/lib/api'
import type { Team } from '@/lib/types'

interface JogadoresTabProps {
  championshipId: string
  teams: Team[]
  onPlayerCreated: () => void
}

export function JogadoresTab({ championshipId, teams, onPlayerCreated }: JogadoresTabProps) {
  const [playerName, setPlayerName] = useState('')
  const [teamId, setTeamId] = useState('')
  const [shirtNumber, setShirtNumber] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!playerName.trim() || !teamId || !shirtNumber) {
      toast.error('Preencha todos os campos')
      return
    }

    setIsCreating(true)
    try {
      await createPlayer({
        name: playerName.trim(),
        teamId,
        shirtNumber: parseInt(shirtNumber),
        championshipId,
      })
      
      setPlayerName('')
      setTeamId('')
      setShirtNumber('')
      onPlayerCreated()
      toast.success('Jogador cadastrado com sucesso!')
    } catch {
      toast.error('Erro ao cadastrar jogador')
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary" />
            Cadastrar Novo Jogador
          </CardTitle>
          <CardDescription>
            Adicione um novo jogador a um time do campeonato
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="player-name">Nome do Jogador</Label>
              <Input
                id="player-name"
                placeholder="Ex: Carlos Santos"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label>Time</Label>
              <Select value={teamId} onValueChange={setTeamId}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Selecione o time" />
                </SelectTrigger>
                <SelectContent>
                  {teams.length > 0 ? (
                    teams.map((team) => (
                      <SelectItem key={team.id} value={team.id}>
                        {team.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>
                      Nenhum time cadastrado
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="shirt-number">Número da Camisa</Label>
              <Input
                id="shirt-number"
                type="number"
                min="1"
                max="99"
                placeholder="Ex: 10"
                value={shirtNumber}
                onChange={(e) => setShirtNumber(e.target.value)}
                className="h-12"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12 font-bold"
              disabled={isCreating || !playerName.trim() || !teamId || !shirtNumber}
            >
              {isCreating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Cadastrando...
                </>
              ) : (
                'Cadastrar Jogador'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
