# Ediomo Ubong Esu — Portfolio

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
- Docker (optional — only needed to run the backend in a container)

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
│   └── page.tsx            # homepage
├── components/
│   ├── layout/             # SiteHeader, SiteFooter
│   ├── theme/              # dark-mode toggle + no-flash init script
│   └── ui/                 # Section, Reveal, Icon, TodoChip
├── content/                # ALL site copy, typed — edit here, not in JSX
│   ├── types.ts            # the content model
│   ├── profile.ts          # name, bio, contact, links
│   ├── identities.ts       # the five professional identities
│   ├── projects.ts         # project catalogue
│   ├── experience.ts       # roles
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

All copy lives in `/content/*.ts` and is fully typed — change text without
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

## Where the project numbers come from

Every figure in `content/projects.ts` is transcribed from a committed result file
in the corresponding source repository — never estimated, never rounded up:

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
should be. Each project entry also carries a `caveat` — the scope limit a reader
should see beside the numbers — and an `attribution` where a dataset licence
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
| POST   | `/api/ml/predict`      | Live ML demo — returns **501 until Phase 6**             |

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
awkward, the service can be swapped for Next.js Route Handlers — the routing,
schema and service layers are already separated, so the port is mechanical.
