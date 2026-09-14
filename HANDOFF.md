# Handoff

Everything you need to keep this site current without touching a component.

The rule the whole thing is built on: **content lives in `/content`, never in a
page.** Pages read typed data and render it. If you want to change what the site
says, you edit a data file - and TypeScript tells you if you break the shape.

---

## Running it

```bash
npm install
```

```bash
npm run dev
```

The backend is optional for local work - the site falls back to the Next route
handlers in `app/api/`. To run it anyway:

```bash
cd backend && pip install -r requirements.txt && uvicorn app.main:app --reload
```

Before you push anything:

```bash
npm run format && npm run typecheck && npm run lint && npm run build
```

---

## The admin panel

`/admin` edits every content collection through forms, so you never have to
open a data file. Saving commits to GitHub and Vercel rebuilds, which means a
content change keeps exactly the same audit trail as a code change.

### One-time setup

```bash
node scripts/hash-password.mjs "a password of at least 12 characters"
```

That prints `ADMIN_PASSWORD_HASH` and `ADMIN_SESSION_SECRET`. Put both in
Vercel's environment variables. Then create a **fine-grained** GitHub token
scoped to this repository alone, with Contents: read and write, and set it as
`GITHUB_TOKEN` along with `GITHUB_REPO` and `GITHUB_BRANCH`.

Until both admin variables are set, `/admin` returns 404 rather than a login
form. A half-configured deploy should look like it has no admin at all, not
like an unlocked one.

### Using it

Pick a collection, edit, save. A commit message is optional. Lists let you add,
delete and reorder; long sub-records such as metrics and media collapse so a
six-metric project is still navigable on a phone.

Locally there is no token, so saving writes straight to `content/data/` and the
dev server hot-reloads. Same forms, no commits.

### The rule the panel enforces

**A metric with a real value must have a method.** Clear the method on a real
figure and the field turns red before you can save; try it anyway through the
API and the save is rejected, naming the exact record. Mark the value
`TODO(metric): ...` and the method becomes optional again, because a TODO is
openly not a result.

That is the master rule of this project made mechanical. You cannot publish a
number you cannot source, even in a hurry, even months from now when the
reasoning has faded.

### If you outgrow it

The panel is schema-driven: [lib/admin/collections.ts](lib/admin/collections.ts)
describes every field, and one form engine renders all fifteen collections. To
add a field, add it to `content/types.ts` and to that schema. There is no
per-collection form to update.

---

## Editing content

| File                    | What it drives                                                          |
| ----------------------- | ----------------------------------------------------------------------- |
| `content/profile.ts`    | Name, headline, location, email, phone, CV link, headshot, social links |
| `content/projects.ts`   | All six case studies - the big one                                      |
| `content/experience.ts` | The roles timeline on `/experience`                                     |
| `content/leadership.ts` | Leadership roles and affiliations                                       |
| `content/education.ts`  | Degrees and certifications                                              |
| `content/teaching.ts`   | `/teaching`                                                             |
| `content/research.ts`   | `/research` findings and stance                                         |
| `content/skills.ts`     | Skill groups and languages (CEFR levels)                                |
| `content/lenses.ts`     | The six identity lenses on the home page                                |
| `content/about.ts`      | `/about`                                                                |

`content/types.ts` is the contract for all of them. Adding a field means adding
it there first.

### The `TODO(...)` convention - read this before adding a number

Anywhere a real value isn't known yet, the string starts with `TODO(`:

```ts
{ label: "Recall on held-out faults", value: "TODO(metric): rerun on the 2024 split" }
```

The site renders these as a visible, labelled placeholder - a `TodoChip` - not
as a number. That is the point. **Never replace a `TODO(metric)` with an
estimate, a rounded-up figure, or a number from memory.** Replace it only with a
value you can point at in a result file, and add a `method` note saying how it
was measured:

```ts
{
  label: "Recall on held-out faults",
  value: "0.83",
  method: "Mean over 5 seeds, TEP faults 1-20, 20% held out",
}
```

`ProjectMetric` also takes `caveat` (rendered in alarm colour, _before_ the
numbers) and `superseded` (renders the old value struck through). Use them - a
number with its limitation attached is worth more in an interview than a clean
number you have to walk back.

### Adding a project

Append to `content/projects.ts` with the next `order` value and a unique `slug`.
The route, the card on `/projects`, the sitemap entry and the reel slot all
appear on their own - `/projects/[slug]` is generated from the data.

If the backend is deployed, mirror the change into it:

```bash
npm run sync:projects
```

That regenerates `backend/data/projects.json` from the TypeScript, so the two
can't drift.

---

## Adding media

1. Drop files into `public/media/<project-slug>/`. The headshot lives at
   `public/media/headshot.jpg`.
2. Reference them from `content/projects.ts` by their `/media/...` path.
3. Re-run the measuring script so `next/image` gets real dimensions and the
   page doesn't shift while loading:

```bash
python scripts/measure-media.py
```

That writes `content/media-manifest.json`. **Run it every time you add an
image** - without intrinsic dimensions, layout shift shows up in Lighthouse.

Keep full-resolution originals in `source-media/` (gitignored). Only the
web-sized copy belongs in `public/`. For reference, the headshot went from
3.6 MB to 93 KB at 800×800, which is ample for a 96 px slot on a 2× display.

Videos take an MP4 **and** a WebM plus a poster still. The player is muted,
looped, lazily loaded and falls back to the poster when the visitor has asked
for reduced motion - so a missing WebM degrades quietly rather than breaking.

---

## Redeploying

The site and the FastAPI service deploy together, from this one repo, in one
command. Vercel builds the Next.js app and `api/index.py` as a Python function
alongside it, so there is no second host and no CORS.

```bash
vercel --prod
```

Full instructions are in [DEPLOY.md](DEPLOY.md), including which of the two API
implementations answers and how to tell.

Remember that `NEXT_PUBLIC_*` values are inlined at build time. Changing the
site URL needs a fresh deploy - not just an environment-variable edit.

---

## Things worth knowing before you change them

- **Design tokens** are in `app/globals.css` (Tailwind v4, CSS-first - there is
  no `tailwind.config.js`). `/design` renders the whole system on one page;
  it is deliberately excluded from `robots.txt`.
- **Text-colour tokens are contrast-tuned.** `--ink-subtle` has to clear 4.5:1
  on the _lightest_ surface it can land on, which is `--surface-raised` -
  interactive cards hover into it. If you darken it, cards fail WCAG AA.
- **Motion** is guarded globally by `MotionConfig reducedMotion="user"` plus a
  `prefers-reduced-motion` block in `globals.css`. Ten components branch on the
  preference individually. New animation should do the same.
- **Every page has exactly one `h1`.** `Section` takes `headingLevel={1}` for a
  page's lead section; `TimelineItem` takes `headingLevel={2}` where the
  timeline sits directly under the page title. Skipping a level is a real
  failure for anyone navigating by headings.
- **OG image, sitemap and JSON-LD are generated from content** - they can't
  drift, and they shouldn't be hand-edited.

### Accessibility status

All 14 routes audited with axe-core 4.10 in **both themes**: zero violations.
Run it again after significant changes.

Note that no Lighthouse run is included here - the CLI isn't installed in this
environment, so there is no score to quote. The axe results above are real
measurements; a Lighthouse number would not be. Run it yourself against the
deployed URL:

```bash
npx lighthouse https://YOUR-DOMAIN --view
```

When auditing in a browser, pin reveals to their settled state first, or you
will chase phantom contrast failures from elements caught mid-fade:

```js
document.head.insertAdjacentHTML(
  "beforeend",
  "<style>*,*::before,*::after{transition:none!important;animation:none!important}[data-reveal],[data-reveal] *{opacity:1!important;transform:none!important}</style>",
);
```

---

## MEDIA TO CAPTURE

Six items are still outstanding. Each one has a labelled slot already on the
site - drop the file at the path given and it appears with no code change. The
full shot list, with what to show in each recording, is in
[docs/MEDIA-TO-CAPTURE.md](docs/MEDIA-TO-CAPTURE.md).

| #   | Type      | Project                                    | Path                                                       |
| --- | --------- | ------------------------------------------ | ---------------------------------------------------------- |
| 1   | Recording | Anomaly Detection & Predictive Maintenance | `/media/anomaly-detection-predictive-maintenance/demo.mp4` |
| 2   | Recording | Pipeline Defect Detection                  | `/media/pipeline-defect-detection/demo.mp4`                |
| 3   | Recording | Ghost-Transaction Detection                | `/media/ghost-transaction-detection/demo.mp4`              |
| 4   | Recording | Energy Asset Digital Twin                  | `/media/energy-asset-digital-twin/demo.mp4`                |
| 5   | Recording | CORE - Petroleum Process Facilities        | `/media/core-anomaly-detection/demo.mp4`                   |
| 6   | Image     | Examination Malpractice Study              | `/media/examination-malpractice-study/findings-table.png`  |

Recordings: 8–15 seconds, no audio, no cursor hunting. MP4 **and** WebM, each
under 3 MB, plus a poster still.

Item 6 is the one that unlocks the most: supplying the thesis results table -
and the numbers behind it - turns roughly twenty `TODO(metric)` placeholders on
that case study into real findings, and makes the findings chart real rather
than a placeholder.

The headshot is done: `public/media/headshot.jpg`, 800×800.
