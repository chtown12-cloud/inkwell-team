# Inkwell Team

Personal task management + team collaboration workspace.

## Features

**Personal** — Your private task manager with notebook scanning, kanban board, calendar, lists, priorities, subtasks, drag-and-drop, and offline support.

**Team** — Shared workspace for up to 10 people: kanban board by status, task assignment, request queue, viewer dashboard for stakeholders.

## Setup

See [DEPLOYMENT.md](./DEPLOYMENT.md) for step-by-step instructions to deploy via GitHub → Supabase → Vercel.

## Tech Stack

- Next.js 14 + React 18
- Supabase (Auth + PostgreSQL + Row Level Security)
- Anthropic Claude API (notebook scanning)
- Vercel (hosting)

## URL Structure

| Route | Purpose |
|-------|---------|
| `/` | Personal tasks |
| `/team` | Team workspace |
| `/submit/[teamId]` | Public request form |
| `/dashboard/[teamId]` | Public viewer dashboard |
