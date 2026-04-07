# Site Portfolio Template

A modern portfolio template built with React, Vite, TypeScript, and Tailwind CSS.

## Features

- First-run setup CLI (`npm run setup`)
- Auto setup check before `npm run dev`
- Config-driven content from a single file (`src/config/config.json`)
- Optional avatar in Hero section
- Animated sections (Hero, Skills, Projects, Contributions, Experience, Contact)
- Contact API endpoint for Telegram notifications

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- Lucide React
- @clack/prompts (setup wizard)

## Quick Start

1. Install dependencies:

```bash
npm install
```

2. Start development:

```bash
npm run dev
```

On first run, setup wizard will start automatically if `.portfolio-configured` is missing.

## Setup Wizard

Run manually any time:

```bash
npm run setup
```

The wizard collects core data:

- name, title, subtitle, bio
- location and optional avatar URL/path
- social links
- skills
- deployment target

For GitHub Pages it also patches `vite.config.ts` base path.

## Single Source of Content

Main content file:

- `src/config/config.json`

Important sections:

- `personal` (name, title, subtitle, bio, location, avatar)
- `contact` (email + social links)
- `skills`
- `projects`
- `contributions`
- `contributors`
- `experience`

## Optional Avatar

Set your image in:

- `src/config/config.json` -> `personal.avatar`

Behavior:

- if `avatar` is set: image is rendered in Hero
- if `avatar` is empty: no avatar block is rendered

## Scripts

- `npm run dev` - run setup check and start Vite dev server
- `npm run setup` - run interactive setup wizard
- `npm run build` - production build
- `npm run preview` - preview build

## Deployment Notes

### Vercel

- Works out of the box for SPA/static deployment.
- Configure environment variables for `api/contact.ts` if using Telegram notifications.

### GitHub Pages

- Select GitHub Pages during setup and provide repository name.
- Setup wizard will patch Vite `base` automatically.

## Contact API (Telegram)

`api/contact.ts` expects:

- `TG_BOT_TOKEN`
- `TG_CHAT_ID`

Without these, form submissions will fail in production.

## License

GPL-3.0
