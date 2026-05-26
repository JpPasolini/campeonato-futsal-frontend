# Futsal Manager

> Sistema completo de gerenciamento de campeonatos de futsal — desenvolvido com Next.js, TypeScript e Tailwind CSS.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?style=for-the-badge&logo=tailwindcss)

## Acesso

Frontend: https://campeonato-futsal-frontend.vercel.app

Backend: https://campeonato-futsal-api.onrender.com

---

## Sobre o Projeto

O **Futsal Manager** é uma aplicação web profissional para gerenciamento completo de campeonatos de futsal. Permite criar campeonatos, cadastrar times e jogadores, registrar partidas com súmula detalhada e acompanhar classificação e artilharia em tempo real.

---

## Funcionalidades

- Criar e gerenciar múltiplos campeonatos
- Cadastrar times com nome e técnico
- Cadastrar jogadores com número de camisa
- Registrar partidas com placar completo
- Súmula com gols, cartões amarelos e vermelhos por jogador
- Tabela de classificação atualizada em tempo real
- Artilharia com estatísticas completas
- Histórico de partidas

---

## Tecnologias

| Tecnologia | Uso |
|---|---|
| Next.js 15 | Framework React para produção |
| TypeScript | Tipagem estática |
| Tailwind CSS | Estilização |
| SWR | Gerenciamento de estado e cache |
| shadcn/ui | Componentes de interface |
| Lucide React | Ícones |

---

## Estrutura do Projeto

    app/
      page.tsx
      championship/[id]/
        page.tsx
    components/
      championship/
        painel-tab.tsx
        partidas-tab.tsx
        times-tab.tsx
        jogadores-tab.tsx
      ui/
    lib/
      api.ts
      types.ts
      utils.ts

---

## Como Rodar Localmente

**Pré-requisitos:** Node.js 18+

    git clone https://github.com/JpPasolini/campeonato-futsal-frontend.git
    cd campeonato-futsal-frontend
    npm install
    npm run dev

Acesse http://localhost:3000 no browser.

---

## Rotas da API

    GET    /api/championships
    POST   /api/championships
    GET    /api/teams?championshipId=
    POST   /api/teams
    GET    /api/players?championshipId=
    POST   /api/players
    GET    /api/matches?championshipId=
    POST   /api/matches

---

## Disciplina

**PROJETO, DESIGN E ENGENHARIA DE PROCESSOS (CCOM5N)**
Curso de Ciência da Computação — Professor Hiago Oliveira
