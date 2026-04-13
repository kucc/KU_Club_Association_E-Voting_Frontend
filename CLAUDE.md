# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev          # Start development server (localhost:3000)
npm run build        # Build production bundle
npm run lint         # Run ESLint
npm run format       # Format all files with Prettier
npm run format:check # Check formatting without writing
```

There is no test suite. Pre-commit hooks run ESLint + Prettier via lint-staged (configured in `.lintstagedrc.json`).

## Architecture

고려대학교 동아리연합회 e-voting system. Next.js 16 App Router with TypeScript strict mode.

**Route groups (in `app/`):**

- `(auth)/` — Authentication flows (planned, currently empty)
- `(members)/` — Member-facing pages: voting history (`board/`) and active polls (`poll/[slug]/`)
- `(managers)/` — Manager-facing pages: dashboard, user management, poll management

Route groups use parentheses so they don't appear in URLs. Role separation is handled at the route-group level.

**Supporting directories:**

- `app/ui/` — Design system primitives (typography, fonts, color tokens); not general-purpose components
- `components/` — shadcn/ui install target for reusable components
- `lib/` — `cn()` utility (clsx + tailwind-merge)
- `stores/` — Zustand stores (empty; planned for global state)
- `services/` — API client functions (empty; planned)
- `providers/` — React context providers (empty; planned)

**State:** Pages currently use local `useState` with mock data. TanStack React Query v5 is installed for future server state. Zustand v5 is installed for future global state.

## Design System

Custom design tokens defined in `app/ui/color.css` as CSS variables (`--voting-*`). Do not use arbitrary Tailwind color values — use these tokens.

Typography lives in `app/ui/typography.tsx`. Use the `<Sans>` wrapper (`app/ui/sans.tsx`) for Pretendard font. The `<T>` component exposes named size variants: `T400`, `T240`, `T200`, `T160`, `T140`, `T120`.

Styling stack: Tailwind CSS v4 + shadcn/ui (Radix Nova style, RSC enabled) + class-variance-authority. Merge classes with `cn()` from `lib/utils`.

Icons live in `public/icons/` as SVGs. Lucide React is available for inline icons.
