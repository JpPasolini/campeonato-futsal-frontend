'use client'

import { useState } from 'react'
import { Loader2, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { createTeam } from '@/lib/api'

interface TimesTabProps {
  championshipId: string
  onTeamCreated: () => void
}

export function TimesTab({ championshipId, onTeamCreated }: TimesTabProps) {
  const [teamName, setTeamName] = useState('')
  const [coach, setCoach] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!teamName.trim() || !coach.trim()) {
      toast.error('Preencha todos os campos')
      return
    }

    setIsCreating(true)
    try {
      await createTeam({
        name: teamName.trim(),
        coach: coach.trim(),
        championshipId,
      })
      
      setTeamName('')
      setCoach('')
      onTeamCreated()
      toast.success('Time cadastrado com sucesso!')
    } catch {
      toast.error('Erro ao cadastrar time')
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Cadastrar Novo Time
          </CardTitle>
          <CardDescription>
            Adicione um novo time ao campeonato
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="team-name">Nome do Time</Label>
              <Input
                id="team-name"
                placeholder="Ex: Atlético FC"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="coach">Técnico</Label>
              <Input
                id="coach"
                placeholder="Ex: João Silva"
                value={coach}
                onChange={(e) => setCoach(e.target.value)}
                className="h-12"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12 font-bold"
              disabled={isCreating || !teamName.trim() || !coach.trim()}
            >
              {isCreating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Cadastrando...
                </>
              ) : (
                'Cadastrar Time'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
