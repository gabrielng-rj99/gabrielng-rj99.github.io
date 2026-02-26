# Gabriel Gomes — Portfolio

Personal portfolio built with **React 19**, **TypeScript**, **Tailwind CSS v4**, and **Vite**.

## Stack

| Layer | Tech |
|-------|------|
| UI | React 19 + TypeScript |
| Styling | Tailwind CSS v4 (Vite plugin) |
| Animations | Framer Motion |
| Particles | tsParticles (slim preset) |
| Icons | react-icons |
| Build | Vite 7 |

## Project Structure

```
src/
├── components/         # React section components
│   ├── About.tsx       # Hero banner + About Me (merged)
│   ├── Contact.tsx     # Contact cards + Acknowledgments + Footer
│   ├── Education.tsx   # Education timeline
│   ├── Experience.tsx  # Experience alternating timeline
│   ├── Navigation.tsx  # Fixed navbar with mobile menu
│   ├── ParticleBackground.tsx  # tsParticles full-screen background
│   ├── Portfolio.tsx   # Featured + regular project cards
│   ├── Skills.tsx      # Expandable skill tree cards
│   └── ThemeToggle.tsx # Light/dark pill toggle
├── content/            # Editable JSON data (no hardcoded text)
│   ├── about.json
│   ├── acknowledgments.json
│   ├── education.json
│   ├── experience.json
│   ├── portfolio.json
│   └── skills.json
├── context/
│   ├── ThemeContext.tsx   # Theme context definition
│   └── ThemeProvider.tsx  # Theme provider with system detection
├── hooks/
│   └── useTheme.ts     # Theme hook
├── App.tsx
├── index.css           # CSS variables, themes, utilities
├── main.tsx
└── vite-env.d.ts

public/assets/          # Static assets served at /assets/
├── download/           # Resume PDF
├── images/             # Section images (about, portfolio, contact, etc.)
└── logo/               # Favicon SVG
```

## Editing Content

All visible text lives in `src/content/*.json`. Edit those files to update the site — no JSX changes needed for content updates.

### Key files

- **about.json** — Name, headline, subtitle, greeting, bio, social links, profile image, resume URL.
- **experience.json** — Work history entries (role, company, period, description bullets).
- **skills.json** — Skill categories with nested tree structure and optional `learning` badges.
- **education.json** — Degrees with institution, period, location, and description.
- **portfolio.json** — Projects with media (image or video), tags, featured flag.
- **acknowledgments.json** — Institution logos shown in the footer area.

## Development

```bash
npm install
npm run dev       # http://localhost:5173
```

## Production Build

```bash
npm run build     # outputs to dist/
npm run preview   # preview the build locally
```

## Features

- **Dark / Light mode** — auto-detects system preference, persists manual choice in localStorage.
- **Particle background** — interactive tsParticles with grab and push effects, visible in the hero area.
- **Smooth animations** — Framer Motion scroll-triggered and entrance animations.
- **Responsive** — mobile-first with adaptive layouts for all sections.
- **Code-split build** — vendor chunks for React, Framer Motion, tsParticles, and icons.