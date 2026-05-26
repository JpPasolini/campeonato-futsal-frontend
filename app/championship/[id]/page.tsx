'use client'

import { use } from 'react'
import useSWR from 'swr'
import { ArrowLeft, Trophy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'
import { swrKeys } from '@/lib/api'
import type { Team, Player, Match } from '@/lib/types'
import { PainelTab } from '@/components/championship/painel-tab'
import { PartidasTab } from '@/components/championship/partidas-tab'
import { TimesTab } from '@/components/championship/times-tab'
import { JogadoresTab } from '@/components/championship/jogadores-tab'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function ChampionshipPage({
                                           params,
                                         }: {
  params: Promise<{ id: string }>
}) {
  const { id: championshipId } = use(params)

  const { data: teams, mutate: mutateTeams } = useSWR<Team[]>(
      swrKeys.teams(championshipId),
      fetcher
  )

  const { data: players, mutate: mutatePlayers } = useSWR<Player[]>(
      swrKeys.players(championshipId),
      fetcher
  )

  const { data: matches, mutate: mutateMatches } = useSWR<Match[]>(
      swrKeys.matches(championshipId),
      fetcher
  )

  return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="icon" className="hover:text-primary hover:bg-primary/10">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Trophy className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h1 className="font-bold text-lg">Campeonato</h1>
                  <p className="text-sm text-muted-foreground">Painel de Controle</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-6">
          <Tabs defaultValue="painel" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 h-12 bg-secondary/50">
              <TabsTrigger value="painel" className="font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Painel
              </TabsTrigger>
              <TabsTrigger value="partidas" className="font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Partidas
              </TabsTrigger>
              <TabsTrigger value="times" className="font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Times
              </TabsTrigger>
              <TabsTrigger value="jogadores" className="font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Jogadores
              </TabsTrigger>
            </TabsList>

            <TabsContent value="painel">
              <PainelTab
                  teams={teams || []}
                  players={players || []}
                  matches={matches || []}
              />
            </TabsContent>

            <TabsContent value="partidas">
              <PartidasTab
                  championshipId={championshipId}
                  teams={teams || []}
                  players={players || []}
                  onMatchCreated={() => {
                    mutateMatches()
                    mutateTeams()
                    mutatePlayers()
                  }}
              />
            </TabsContent>

            <TabsContent value="times">
              <TimesTab
                  championshipId={championshipId}
                  onTeamCreated={mutateTeams}
              />
            </TabsContent>

            <TabsContent value="jogadores">
              <JogadoresTab
                  championshipId={championshipId}
                  teams={teams || []}
                  onPlayerCreated={mutatePlayers}
              />
            </TabsContent>
          </Tabs>
        </main>
      </div>
  )
}