'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { Trophy, Plus, ChevronRight, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import Link from 'next/link'
import { createChampionship, swrKeys } from '@/lib/api'
import type { Championship } from '@/lib/types'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function LobbyPage() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [newChampionshipName, setNewChampionshipName] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  const { data: championships, mutate, isLoading } = useSWR<Championship[]>(
    swrKeys.championships,
    fetcher
  )

  const handleCreateChampionship = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newChampionshipName.trim()) return

    setIsCreating(true)
    try {
      await createChampionship(newChampionshipName.trim())
      await mutate()
      setNewChampionshipName('')
      setDialogOpen(false)
      toast.success('Campeonato criado com sucesso!')
    } catch {
      toast.error('Erro ao criar campeonato')
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%2339FF14%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50" />
        
        <div className="relative container mx-auto px-4 py-24 md:py-32">
          <div className="flex flex-col items-center text-center gap-6">
            <div className="flex items-center gap-3 text-primary">
              <Trophy className="h-12 w-12 md:h-16 md:w-16" />
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight text-balance">
              <span className="text-primary drop-shadow-[0_0_30px_rgba(57,255,20,0.5)]">FUTSAL</span>
              <br />
              <span className="text-foreground">MANAGER</span>
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl text-pretty">
              O sistema definitivo para gerenciamento profissional de campeonatos de futsal. 
              Controle times, jogadores, partidas e estatísticas em um só lugar.
            </p>
            
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="mt-4 text-lg font-bold h-14 px-8 gap-2 shadow-[0_0_20px_rgba(57,255,20,0.3)] hover:shadow-[0_0_30px_rgba(57,255,20,0.5)] transition-shadow">
                  <Plus className="h-5 w-5" />
                  Criar Novo Campeonato
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold">Criar Campeonato</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateChampionship} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="championship-name">Nome do Campeonato</Label>
                    <Input
                      id="championship-name"
                      placeholder="Ex: Copa Verão 2024"
                      value={newChampionshipName}
                      onChange={(e) => setNewChampionshipName(e.target.value)}
                      className="h-12"
                    />
                  </div>
                  <Button type="submit" className="w-full h-12 font-bold" disabled={isCreating}>
                    {isCreating ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Criando...
                      </>
                    ) : (
                      'Criar Campeonato'
                    )}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </section>

      {/* Championships List */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">Campeonatos</h2>
          <span className="text-muted-foreground">
            {championships?.length || 0} campeonato(s)
          </span>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : championships && championships.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {championships.map((championship) => (
              <Card 
                key={championship.id} 
                className="group hover:border-primary/50 transition-all hover:shadow-[0_0_20px_rgba(57,255,20,0.1)]"
              >
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Trophy className="h-5 w-5 text-primary" />
                    </div>
                    <span className="truncate">{championship.name}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Criado em {new Date(championship.createdAt).toLocaleDateString('pt-BR')}
                    </span>
                    <Link href={`/championship/${championship.id}`}>
                      <Button variant="ghost" size="sm" className="group-hover:text-primary group-hover:bg-primary/10">
                        Entrar
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Trophy className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Nenhum campeonato encontrado</h3>
              <p className="text-muted-foreground mb-4">
                Crie seu primeiro campeonato para começar!
              </p>
              <Button onClick={() => setDialogOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Criar Campeonato
              </Button>
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  )
}
