# Sebastian's Portfolio Site

## Overview

This is the personal portfolio site for **Sebastian Noel**, a computer science student focused on software engineering. The domain will be **snoel.dev** (not yet purchased, will be registered through Cloudflare). The site is intended to be unique, creative, clean, and polished with excellent UX. It should represent Sebastian's personality and technical depth.

## Setup Status

| Step | Status |
|---|---|
| Next.js scaffold | ✅ Done |
| GitHub Actions CI | ✅ Done |
| Tailwind color palette + fonts | ✅ Done |
| Folder structure | ✅ Done |
| shadcn/ui | ⬜ Pending |
| GSAP + Upstash dependencies | ⬜ Pending |
| Vercel deployment | ⬜ Pending |
| Domain (snoel.dev via Cloudflare) | ⬜ Pending |

---

## Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | Next.js + React + TypeScript + ESLint | Industry standard, SSR/SSG support, great DX |
| Styling | Tailwind CSS + shadcn/ui | Utility-first styling, accessible unstyled component primitives |
| Animation | GSAP via `@gsap/react` | Complex timeline animations, scroll-driven effects |
| Images | Stored locally in `public/images/` | Small number of images (~10 per album, few albums total), no external service needed |
| Video | YouTube embeds | Zero hosting cost, handles streaming and compression |
| Audio | Web Audio API (no external library) | Built into browsers, handles overlapping sounds correctly for typing mechanic |
| Global counter | Upstash Redis + `@upstash/ratelimit` | Serverless-compatible, perfect for simple counters, pairs with Next.js Server Actions |
| Hosting | Vercel | Seamless Next.js deployment |
| Domain | snoel.dev via Cloudflare (not yet purchased) | Cloudflare sells at wholesale cost, free WHOIS privacy, easy Vercel connection |
| CI/CD | GitHub + GitHub Actions | Automated checks on push/PR |

**Not used and why:**

- No Docker — Vercel abstracts environment, single developer, unnecessary complexity
- No AWS S3 — egress fees, excessive complexity for this scope
- No Cloudinary — image count is small enough to store locally
- No Framer Motion — GSAP was a deliberate choice for more control

---

## GSAP Important Note

Always use the `useGSAP` hook from `@gsap/react` instead of raw GSAP calls inside React components. Raw GSAP usage without this hook causes memory leaks because animations are not cleaned up when components unmount. `useGSAP` handles this automatically.

---

## Site Structure

Four pages total:

### `/` — Home

1. **Hero section** — Sebastian's name (large, bold), headshot photo, short personal description, important links (resume, linkedin, github). Staggered entrance animation on load using GSAP (each element animates in piece by piece).
2. **About section** — Personal summary. Ends with a brief mention of hobbies (mechanical keyboards, custom PC building, gaming, anime/manga and others). This is a short personal touch, not the focus of the section.
3. **Typing Test** — Interactive feature described in detail below.

### `/experience` — Experience

- Vertical chronological timeline, newest first
- Each entry is a card containing:
  - Job/role title
  - Organization name
  - Date range (ongoing entries show "Present")
  - Short description
  - Bullet points of responsibilities/achievements
  - Skill tags
  - 3-image autoscrolling carousel
- A type tag differentiates entries: `Internship` / `Research` / `Leadership`
- All experience types live in one unified timeline, not separate sections
- Ongoing experiences get a visual treatment to distinguish them (e.g. accent-colored "Present" badge or subtle animated indicator)

### `/projects` — Projects

- Grid layout (3 columns with as many rows as needed based on projects amount)
- Unified card design across all project types
- Each card contains buttons with links to the following if available: Live Link, GitHub, Demo, Devpost
- Clicking a card opens an expanded view with full project details
- Project range is intentionally wide to show breadth: web apps, mobile app, processing pipelines, game development, robotics projects

### `/media` — Media

- Grid of album cards, each slightly rotated and loaded in one by one
- Each album card shows a title and cover image
- Clicking opens an expanded album view containing:
  - 1–3 short paragraphs of contextual text about the event
  - Photos (stored locally in `public/images/`)
  - Embedded YouTube videos where applicable
- Albums represent events like hackathons, conferences, etc.

### Navigation Bar (sitewide)

Links: `Home` · `Experience` · `Projects` · `Media`

- Active page should be visually indicated
- Clean, minimal design

### Footer (sitewide)

- GitHub link
- LinkedIn link
- Email as `mailto:` link (not plain text, reduces scraping)
- No contact form

---

## Design System

### Colors (Tailwind config)

```js
colors: {
  'text': '#ced4ee',
  'background': '#090910',
  'primary': '#98a0e6',
  'secondary': '#22358c',
  'accent': '#7b91f4',
}
```

**Semantic usage — this must be respected consistently:**

- `background` — page and surface backgrounds
- `text` — all body copy and general text
- `primary` — static UI elements, labels, tags, icons, informational elements
- `secondary` — card surfaces, borders, containers that sit above the background
- `accent` — interactive elements ONLY: hover states, active states, links, focused inputs, buttons

### Typography

- **Display font:** General Sans (Fontshare) — used exclusively for Sebastian's name in the hero section. Variable font, load as a single file.
- **Primary font:** Rubik (Google Fonts) — used for everything else across all pages
- **Type scale using Rubik:**

| Level | Usage | Weight |
|---|---|---|
| H1 | Page titles | 700 |
| H2 | Section headings | 600 |
| H3 | Card titles | 500–600 |
| Body | Descriptions, paragraphs | 400 |
| Caption | Tags, metadata, dates | 300–400 |

### Dark Mode

Dark mode only. No light mode. No toggle.

---

## Typing Test Feature (detailed)

Located at the bottom of the Home page, below the About section. This placement is intentional — the About section mentions mechanical keyboards as a hobby, and the typing test immediately lets users experience Sebastian's actual keyboard sounds. This is a deliberate narrative flow.

### Mechanic

- A sentence is randomly selected from a bank of sentences, each one a fact about Sebastian (clubs, hackathons, internships, research, personal facts, etc.)
- The user types the sentence
- A **shadow cursor** moves through the text at exactly 100 WPM, representing Sebastian as the opponent. This is a smooth GSAP animation running on a fixed timeline. At 100 WPM = 500 characters/minute, each character takes 120ms on average. The cursor interpolates smoothly between character positions.
- The user must beat the shadow cursor to win

### Win/Loss conditions

- **Win:** User completes the sentence faster than the 100 WPM cursor, with at least 90% accuracy
- **Loss:** User is slower than the cursor OR finishes with less than 90% accuracy OR ties (must beat, not match)
- Accuracy is calculated as: characters typed correctly / total characters in sentence (errors count even if corrected via backspace — this is the MonkeyType standard and prevents gaming)
- Copy-paste is disabled on the input field

### Global Counter

- Wins and losses are tracked globally across all users via **Upstash Redis**
- Displayed above the test as a live scoreboard (e.g. total wins, total losses, global win rate %)
- Counter updates in real time after each completed attempt
- Counter increments on every attempt — users can retry as many times as they want, all results count
- Rate limiting via `@upstash/ratelimit` to prevent abuse (per IP)
- Implemented via **Next.js Server Actions** (no separate API route needed)

### Audio

- Custom mechanical keyboard sounds sampled from Sebastian's actual keyboard
- Categories of samples:
  - Regular key clicks (~10 samples)
  - Spacebar (~5 samples)
  - Backspace (~5 samples)
  - Tab (~5 samples)
- On each keydown event, a sample is randomly selected from the appropriate category and played
- Randomization prevents robotic repetition
- Implemented with the **Web Audio API** (not HTML `<audio>` tags) — this is required because Web Audio handles rapid overlapping sounds correctly, which HTML audio does not
- All audio clips are preloaded into memory when the component mounts (inside `useEffect`) to eliminate latency on keypress
- Audio clips stored in `public/sounds/`
- The typing test component should be **lazy loaded** using Next.js `dynamic()` with `{ ssr: false }` so the audio files don't block the initial page load

---

## Folder Structure

```
/
├── public/
│   ├── images/          # Assets throughout site, e.g. experience card images
│   ├── albums/          # Album photos, each album will be in a separate folder within
│   ├── sounds/          # Mechanical keyboard audio samples
│   └── fonts/           # General Sans font files from Fontshare
├── src/
│   ├── app/             # Next.js App Router pages
│   │   ├── page.tsx     # Home (hero, about, typing test)
│   │   ├── experience/
│   │   │   └── page.tsx
│   │   ├── projects/
│   │   │   └── page.tsx
│   │   └── media/
│   │       └── page.tsx
│   ├── components/
│   │   ├── ui/          # shadcn/ui generated components
│   │   ├── layout/      # Navbar, Footer
│   │   ├── home/        # Hero, About, TypingTest
│   │   ├── experience/  # Timeline, ExperienceCard, ImageCarousel
│   │   ├── projects/    # ProjectGrid, ProjectCard, ProjectFilter
│   │   └── media/       # AlbumGrid, AlbumCard, AlbumView
│   ├── lib/             # Utility functions, Redis client, helpers
│   ├── data/            # Static data: sentences bank, experience entries, projects, albums
│   └── types/           # TypeScript interfaces and types
├── CLAUDE.md            # This file
└── .nvmrc               # Node version pin
```

---

## GitHub Actions

CI runs on every push and pull request to `main` via `.github/workflows/ci.yml`:

- Type checking (`tsc --noEmit`)
- Linting (`eslint`)
- Build check (`next build`)

Vercel handles deployment automatically via its GitHub integration — GitHub Actions is for quality checks only, not deployment.

---

## Development Principles

- **Learn-first approach:** Sebastian is a second-year CS student actively learning web development. Code should be well-commented where non-obvious, and patterns should follow current best practices so he learns correct habits, this does not mean to comment everything though. Explain what and why everything was done in chat during development as well.
- **No unnecessary dependencies:** Every package added should have a clear, justified reason.
- **Performance matters:** The media section and typing test have specific performance requirements (lazy loading, audio preloading, image optimization via Next.js `<Image>` component).
- **Consistency:** Color semantic roles and typography hierarchy defined above must be followed across all components — do not introduce ad hoc colors or font sizes outside the design system.
