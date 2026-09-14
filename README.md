# Ediomo Ubong Esu - Portfolio

Personal portfolio presenting five professional identities: **data scientist**
(energy / oil & gas regulatory analytics), **AI/ML & backend engineer**,
**educator**, **emerging leader**, and **project manager**.

Built as a Next.js frontend plus a small FastAPI service, so the site is itself
evidence of the backend-engineering identity it describes.

---

## Stack

| Layer     | Choice                                                         |
| --------- | -------------------------------------------------------------- |
| Framework | Next.js 16 (App Router) + TypeScript                           |
| Styling   | Tailwind CSS v4 with a custom design-token layer               |
| Motion    | Framer Motion (`motion` package) + native `<video>` (MP4/WebM) |
| Data viz  | Recharts                                                       |
| Backend   | FastAPI (Python), containerised                                |
| Content   | Typed data files in `/content`                                 |

---

## Prerequisites

- Node.js 20+ (developed on 24) and npm
- Python 3.11+ (developed on 3.14)
- Docker (optional - only needed to run the backend in a container)

---

## Quick start

```bash
cp .env.example .env.local
npm install
npm run dev
```

The site then runs at http://localhost:3000.

It renders fully **without** the backend: when `NEXT_PUBLIC_API_BASE_URL` is
empty, `lib/api.ts` reads from the typed content files in `/content` instead.

### Backend

```bash
cd backend && python -m venv .venv && source .venv/Scripts/activate && pip install -r requirements-dev.txt
```

On macOS/Linux the activate path is `.venv/bin/activate`.

```bash
cd backend && source .venv/Scripts/activate && uvicorn app.main:app --reload --port 8000
```

- API root: http://localhost:8000
- Interactive docs: http://localhost:8000/docs
- Health check: http://localhost:8000/api/health

### Backend in Docker

```bash
docker compose up --build api
```

---

## Scripts

| Command                 | What it does                          |
| ----------------------- | ------------------------------------- |
| `npm run dev`           | Next.js dev server                    |
| `npm run build`         | Production build                      |
| `npm start`             | Serve the production build            |
| `npm run lint`          | ESLint                                |
| `npm run typecheck`     | TypeScript, no emit                   |
| `npm run format`        | Prettier, with Tailwind class sorting |
| `pytest` (in `backend`) | Backend test suite                    |

---

## Project structure

```
.
├── app/                    # Next.js App Router
│   ├── globals.css         # design tokens + base layer (edit tokens here)
│   ├── layout.tsx          # metadata, fonts, header/footer, skip link
│   ├── page.tsx            # home
│   ├── about/ contact/ experience/ leadership/ teaching/
│   ├── projects/           # index + [slug] case studies
│   ├── api/contact/        # route handler used when the FastAPI service is absent
│   └── design/             # internal style guide (noindex, not linked)
├── components/
│   ├── layout/             # SiteHeader, SiteFooter
│   ├── motion/             # MotionProvider (global reduced-motion guard), tokens
│   ├── theme/              # light-mode toggle + no-flash init script
│   └── ui/                 # the design-system primitives
├── content/                # ALL site copy, typed - edit here, not in JSX
│   ├── types.ts            # the content model
│   ├── profile.ts          # name, bio, contact, links
│   ├── about.ts            # narrative bio + regulator context
│   ├── identities.ts       # the five professional identities
│   ├── projects.ts         # project catalogue
│   ├── experience.ts       # roles
│   ├── leadership.ts       # leadership and convening roles
│   ├── teaching.ts         # subjects, clubs, mentorship
│   ├── education.ts        # study + certifications
│   ├── skills.ts           # skill groups
│   └── metrics/            # measured results, extracted from the project repos
├── lib/
│   ├── api.ts              # typed client for the FastAPI service (with fallback)
│   ├── content.ts          # TODO-sentinel helpers, date formatting
│   ├── site.ts             # site metadata + nav
│   └── utils.ts            # cn()
├── public/
│   ├── images/projects/    # figures lifted from the source repos
│   └── media/              # demo reels (MP4 + WebM)
├── scripts/
│   └── export-projects.mts # /content -> backend/data/projects.json
├── backend/                # FastAPI service
│   ├── app/
│   │   ├── main.py         # app, CORS, router mounting
│   │   ├── core/config.py  # environment-backed settings
│   │   ├── api/routes/     # health, projects, contact, ml
│   │   ├── schemas/        # Pydantic contracts (mirror /content/types.ts)
│   │   └── services/       # project store, mailer, ML demo
│   ├── data/projects.json  # project catalogue served by the API
│   ├── tests/              # pytest suite
│   └── Dockerfile
├── docker-compose.yml
└── .env.example
```

---

## Editing content

All copy lives in `/content/*.ts` and is fully typed - change text without
touching a component. Two conventions matter:

**1. Placeholders are explicit.** Any value of the form `TODO(...)` is treated
as missing data. `isTodo()` in `lib/content.ts` detects it, and the UI renders a
visible amber chip instead of the text. Nothing unverified is ever displayed as
though it were a result.

```ts
metrics: [{ label: "Forecast error (MAPE)", value: "TODO(metric)" }];
```

Replace the sentinel with the real figure once it is measured, and add `method`
to record how it was derived.

**2. The backend mirrors the content model.** `/content` is the single source of
truth; `backend/data/projects.json` is generated from it by `npm run sync:projects`,
so the two cannot drift. Run it after editing `content/projects.ts`. The contract
test in `backend/tests/test_api.py` guards the field names, and
`backend/app/schemas/project.py` must gain any field added to `content/types.ts`.

---

## Routes

| Route              | What it holds                                                    |
| ------------------ | ---------------------------------------------------------------- |
| `/`                | Hero, quick stats, the five-identity switcher, featured projects |
| `/projects`        | All projects, filterable by identity and by skill                |
| `/projects/[slug]` | Case study per project - caveat first, then the figures          |
| `/experience`      | Timeline of professional roles                                   |
| `/leadership`      | Student government, convening, community and media roles         |
| `/teaching`        | Subjects taught, clubs led, mentorship                           |
| `/about`           | Narrative bio, regulator context, education, CV download         |
| `/contact`         | Form posting to the backend, plus every direct route             |
| `/design`          | Internal style guide (noindex, not linked)                       |

The header is sticky, marks the active route with `aria-current="page"`, and
collapses below `lg` into a disclosure menu that closes on Escape and returns
focus to its toggle.

**Contact submissions** go to the FastAPI service when
`NEXT_PUBLIC_API_BASE_URL` is set, and to `app/api/contact/route.ts` otherwise.
Both validate identically, share the honeypot and the per-IP hourly limit, and
**log rather than send** unless SMTP is configured. Change one and change the
other.

---

## Design system

**Control Room.** The palette follows ISA-101, the human-machine-interface
standard used in process plants: a desaturated grey field where saturated
colour is reserved for exceptional states. There are exactly two accents and
both carry meaning:

| Token           | Meaning                                                   |
| --------------- | --------------------------------------------------------- |
| `alarm` (amber) | a figure that is qualified, or a live alarm state         |
| `normal` (teal) | a figure that is measured and verified; interactive state |

Nothing else is allowed to be saturated. Identities are distinguished by an
instrument tag (`DS`, `ML`, `ED`, `LD`, `PM`) and typography rather than by
hue - five decorative colours would contradict the rule the palette rests on.

**Dark is the default.** The `light` class is added to `<html>` only when the
visitor asks for it, so no class means dark. Light mode is ISA grey rather than
white, because a white field in a control room is glare.

**Type.** Archivo for display and figures, IBM Plex Sans for body, IBM Plex Mono
for data and instrument labels. Loaded via `next/font`, exposed as
`font-display` / `font-sans` / `font-mono`.

**Primitives** live in `components/ui` and are re-exported from
`components/ui/index.ts`:

`Container` · `Section` · `Heading` / `Overline` · `Pill` · `Card` · `Stat` ·
`Timeline` / `TimelineItem` · `MediaFrame` · `BeforeAfterSlider` · `Marquee` ·
`Reveal` / `RevealGroup` / `RevealItem` · `TodoChip` · `Icon`

`Stat` is the signature element: it renders a figure together with whatever
qualifies it - the superseded value struck through, and the caveat in amber.

**Motion.** Three durations and two easings, defined once in
`components/motion/motion-tokens.ts` and mirrored as CSS custom properties.
`MotionConfig reducedMotion="user"` in `components/motion/MotionProvider.tsx`
wraps the whole tree, so no component checks the preference itself; CSS
transitions are covered by a `prefers-reduced-motion` block in `globals.css`.
The shared hover treatment is the `interactive` utility.

Run the dev server and open **/design** to see every primitive rendered against
real content. The route is `noindex` and is not linked from the site.

---

## The five-identity lens

The home page can be read through any of five professional identities. The
selected lens rewrites the hero line, the highlighted skills, the surfaced CV
material and the featured projects, cross-fading between them with
`AnimatePresence`.

**The selection lives in the URL, not in component state:**

```
/?lens=data-scientist   /?lens=ai-engineer   /?lens=educator
/?lens=leader           /?lens=project-manager
```

So a single link opens the site already framed for whoever it was sent to - a
school, a fellowship panel, a programme office. Back and forward work, the view
is shareable, and there is a copy-link button beside the tabs. An unknown or
missing value falls back to the first lens rather than erroring.

Lens content lives in `content/lenses.ts`. The switcher is a real tablist with
roving tabindex and arrow-key navigation, wrapped in a `Suspense` boundary so
the statically rendered page still ships complete, indexable HTML.

---

## Media

All imagery lives in `/public/media/<project-slug>/`. Intrinsic dimensions are
generated into `content/media-manifest.json` and read by `lib/media.ts`, so
`next/image` always gets a width and height and layout space is reserved before
a file arrives. Everything below the fold loads lazily.

**Anything not yet captured is a labelled slot, not a gap.** A `TODO(media)`
source renders as a dashed amber frame carrying the exact shot required, and
`docs/MEDIA-TO-CAPTURE.md` - generated from the content, so it cannot drift -
lists every one with its target path.

**Demo reels** use `components/ui/VideoReel.tsx`: MP4 with a WebM source ahead
of it, muted, looping, `playsInline`, `preload="none"`, a required poster, and
a visible play/pause control. Never autoplay with sound; never autoplay at all
under reduced motion, where the poster shows instead and the control still
reaches the footage. Target under 3 MB per file.

**The live demo** at `/projects/ghost-transaction-detection` posts to the
FastAPI service when one is configured and to `app/api/ml/predict/route.ts`
otherwise. Both run the project's explainable rule tier - real logic, no
trained model, no labels - and the response says so. `is_full_drain` is
computed and shown but scored at zero, because that feature encoded the
simulator rather than fraud.

---

## Case-study motion assets

Each case study opens with a bespoke animated asset in
`components/projects/motion/`, resolved from the project's `motionAsset` field:

| Asset                | Project                   | Driven by                                                                                                         |
| -------------------- | ------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `anomaly-timeseries` | Anomaly detection         | A real TEP Fault 1 sensor trace; the line draws in and the dataset's own labelled fault points light up behind it |
| `gradcam-slider`     | Pipeline defect detection | The real clean-versus-blurred input pair, as a wipe                                                               |
| `transaction-graph`  | Ghost transactions        | A schematic of the ghost-destination pattern, labelled as a diagram rather than a result                          |
| `dashboard-mock`     | Digital twin              | The real per-well skill scores, with tiles taking focus in turn                                                   |
| `findings-chart`     | Thesis                    | A placeholder until the study's results table is supplied                                                         |

Two rules these follow. Anything driven by real data says where the data came
from, and anything that is an illustration says so in its caption - an animated
graph that looks like output while showing none is a lie with good production
values. All of them honour reduced motion through the global `MotionConfig`,
and the looping ones stop when scrolled out of view.

---

## Where the project numbers come from

Every figure in `content/projects.ts` is transcribed from a committed result file
in the corresponding source repository - never estimated, never rounded up:

| Project                     | Source of truth                                                            |
| --------------------------- | -------------------------------------------------------------------------- |
| Ghost Transaction Detection | `reports/REPORT.md`                                                        |
| Pipeline Defect Detection   | `reports/results.csv`, `cv_results.csv`, `robustness.csv`, `benchmark.csv` |
| CORE Anomaly Detection      | `tep_model_summary.csv`, `tep_per_fault_fdr.csv`, `mspc_per_fault.csv`     |
| Energy Asset Digital Twin   | `models/<well>/manifest.json`                                              |

The machine-readable extracts live in `content/metrics/` and are what the charts
render. Figures in `public/images/projects/` were copied from each repo's
`reports/figures/`, `assets/` or `screenshots/` directory.

**No datasets, model binaries or secrets were copied into this project**, and none
should be. Each project entry also carries a `caveat` - the scope limit a reader
should see beside the numbers - and an `attribution` where a dataset licence
requires one.

---

## API

| Method | Path                   | Purpose                                                  |
| ------ | ---------------------- | -------------------------------------------------------- |
| GET    | `/api/health`          | Liveness probe                                           |
| GET    | `/api/projects`        | Project metadata; `?identity=` and `?featured=` filters  |
| GET    | `/api/projects/{slug}` | One project                                              |
| POST   | `/api/contact`         | Validates and forwards a message (honeypot + rate limit) |
| GET    | `/api/ml/model-info`   | Demo model status                                        |
| POST   | `/api/ml/predict`      | Live ML demo - returns **501 until Phase 6**             |

Contact messages are **logged, not sent**, unless SMTP credentials are set, so
local development never needs a mailbox.

---

## Quality bar

- Mobile-first responsive layout
- Semantic HTML, skip link, keyboard navigable, visible focus rings
- `prefers-reduced-motion` respected globally (CSS) and per component
  (`useReducedMotion` in `components/ui/Reveal.tsx`)
- Lighthouse target of 90+ across all four categories
- `next/image` for images; media lazy-loaded

---

## Deployment notes

The frontend deploys to Vercel unchanged. The FastAPI service needs a container
host (Fly.io, Railway, Render, Cloud Run). If a separate Python host proves
awkward, the service can be swapped for Next.js Route Handlers - the routing,
schema and service layers are already separated, so the port is mechanical.
