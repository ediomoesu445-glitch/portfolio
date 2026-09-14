# Deploying

Two pieces deploy independently: the Next.js site and the FastAPI service. The
site runs perfectly well without the service — every page falls back to the
typed content in `/content` — so deploy the frontend first, confirm it, then
add the backend.

---

## 1. Frontend → Vercel

```bash
npm i -g vercel
```

```bash
vercel link
```

Then set the environment variables. `NEXT_PUBLIC_SITE_URL` matters more than it
looks: it is what canonical links, the sitemap, `robots.txt` and the Open Graph
card all resolve against. Leave it unset and your share cards will say
`localhost:3000`.

```bash
vercel env add NEXT_PUBLIC_SITE_URL production
```

```bash
vercel env add NEXT_PUBLIC_API_BASE_URL production
```

Deploy a preview, check it, then promote:

```bash
vercel
```

```bash
vercel --prod
```

Vercel detects Next.js on its own — no build command or output directory to
configure.

### If you skip the backend

Leave `NEXT_PUBLIC_API_BASE_URL` empty. The contact form and the live scorer
both fall back to the Next route handlers in `app/api/`, which run the same
validation and the same rules. Nothing breaks; the Python service simply is not
part of the request path.

---

## 2. Backend → Render, Railway, Fly, or any container host

The service is a standard FastAPI app with a `Dockerfile`. It has no database
and no persistent state, so the smallest instance any host offers is enough.

### Render

New → Web Service → point at the repo, root directory `backend`.

```
Build command:  pip install -r requirements.txt
Start command:  uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

### Railway

```bash
npm i -g @railway/cli
```

```bash
railway up --service portfolio-api
```

Railway reads `backend/Dockerfile`. Set the root directory to `backend` in the
service settings.

### Fly.io

```bash
fly launch --dockerfile backend/Dockerfile --no-deploy
```

```bash
fly deploy
```

### Any Docker host

```bash
docker build -t portfolio-api ./backend
```

```bash
docker run -p 8000:8000 --env-file backend/.env portfolio-api
```

### After the backend is up

Point the site at it and allow it through CORS — both, or the browser will
block the call:

```bash
vercel env add NEXT_PUBLIC_API_BASE_URL production
```

Set `CORS_ORIGINS` on the backend to the site's real origin, then redeploy the
frontend so the new variable is baked in (`NEXT_PUBLIC_*` values are inlined at
build time, not read at runtime).

---

## Environment variables

| Variable                                            | Where    | What it does                                                     |
| --------------------------------------------------- | -------- | ---------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`                              | Frontend | Canonical URLs, sitemap, robots, OG card. **Set this.**          |
| `NEXT_PUBLIC_API_BASE_URL`                          | Frontend | FastAPI base URL. Empty = use the built-in route handlers.       |
| `CORS_ORIGINS`                                      | Backend  | Comma-separated origins allowed to call the API.                 |
| `ENVIRONMENT`                                       | Backend  | `production` in production.                                      |
| `SMTP_HOST` `SMTP_PORT` `SMTP_USER` `SMTP_PASSWORD` | Backend  | Contact delivery. **Unset means messages are logged, not sent.** |
| `CONTACT_TO_EMAIL`                                  | Backend  | Where contact messages go.                                       |
| `CONTACT_RATE_LIMIT_PER_HOUR`                       | Backend  | Per-IP submissions allowed. Default 5.                           |

`.env.example` at the repo root lists all of them with comments.

**Contact messages are logged rather than emailed until SMTP is configured.**
That is deliberate — nothing is sent by accident from a fresh deploy — but it
does mean a live site with no SMTP silently drops enquiries. Set SMTP before
sharing the link, or rely on the direct email and phone links, which always work.

---

## Post-deploy checklist

```bash
curl -s https://YOUR-DOMAIN/robots.txt
```

```bash
curl -s https://YOUR-DOMAIN/sitemap.xml | head -20
```

- Open `https://YOUR-DOMAIN/opengraph-image` — the card should show your real
  domain in the corner, not `localhost:3000`. If it does not,
  `NEXT_PUBLIC_SITE_URL` was not set at build time.
- Paste the URL into LinkedIn's post composer and confirm the card renders.
- Submit the contact form once and confirm it arrives (or appears in the
  backend logs, if SMTP is not configured yet).
- `https://YOUR-DOMAIN/design` should be reachable but excluded by `robots.txt`.

---

## Custom domain

Add it in Vercel → Settings → Domains, then update `NEXT_PUBLIC_SITE_URL` to
match and redeploy. Anything that embeds the URL — sitemap, OG card, JSON-LD —
is generated at build time, so the redeploy is what makes the change take.
