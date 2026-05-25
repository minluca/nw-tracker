# NW Tracker

Personal finance and net worth tracking web app.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL (Supabase)
- **ORM:** Prisma 7
- **Auth:** Clerk
- **Styling:** Tailwind CSS + shadcn/ui
- **Deploy:** Vercel

## Dashboards

- [Clerk](https://clerk.com/dashboard) — autenticazione e utenti
- [Supabase](https://supabase.com/dashboard) — database
- [Vercel](https://vercel.com/dashboard) — deploy e logs
- [ngrok](https://dashboard.ngrok.com) — tunnel locale per webhook

## Getting Started

Installa le dipendenze:

```bash
npm install
```

Crea un file `.env` partendo da `.env.example` e compila le variabili.

Avvia il server di sviluppo:

```bash
npm run dev          # solo Next.js
npm run dev:tunnel   # Next.js + ngrok (per testare i webhook)
```

## Scripts

| Comando              | Descrizione                           |
| -------------------- | ------------------------------------- |
| `npm run dev`        | Avvia Next.js in locale               |
| `npm run dev:tunnel` | Avvia Next.js + ngrok                 |
| `npm run build`      | Build di produzione                   |
| `npm run db:migrate` | Crea e applica una nuova migrazione   |
| `npm run db:studio`  | Apre Prisma Studio (GUI del database) |

## Environment Variables

Vedi `.env.example` per la lista completa delle variabili necessarie.
