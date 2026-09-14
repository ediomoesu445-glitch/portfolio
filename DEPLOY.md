# Deploying

The site and the FastAPI service deploy **together**, from this one repo, in a
single command. Vercel builds the Next.js app as usual and `api/index.py` as a
Python serverless function alongside it. One platform, one deploy, one domain.

Because the API lands on the same origin as the site, there is no CORS to
configure and no second dashboard to keep track of.

---

## Deploy

```bash
npm i -g vercel
```

```bash
vercel link
```

Set the two environment variables. `NEXT_PUBLIC_SITE_URL` matters more than it
looks: canonical links, the sitemap, `robots.txt` and the Open Graph card all
resolve against it. Leave it unset and your share cards will say
`localhost:3000`.

```bash
vercel env add NEXT_PUBLIC_SITE_URL production
```

```bash
vercel env add NEXT_PUBLIC_API_BASE_URL production
```

Set that second one to exactly `/api/py` - a relative path, not a full URL.
Both callers run in the browser, so a relative base resolves against whatever
domain the site is on and keeps working when you add a custom domain.

Deploy a preview, check it, then promote:

```bash
vercel
```

```bash
vercel --prod
```

Vercel detects Next.js on its own. No build command or output directory to
configure.

---

## How the two halves fit together

| Path                              | Served by                   |
| --------------------------------- | --------------------------- |
| `/`, `/about`, `/projects/*`, …   | Next.js, prerendered        |
| `/api/contact`, `/api/ml/predict` | Next.js route handlers      |
| `/api/py/api/*`                   | FastAPI, via `api/index.py` |

The Next.js app already owns `/api/contact` and `/api/ml/predict`, so FastAPI
is mounted one level down at `/api/py` rather than colliding with them. That
doubled `/api` segment is internal - nothing links to it by hand.

Three files make this work:

- **`api/index.py`** puts `backend/` on the path and mounts the service.
- **`vercel.json`** ships `backend/**` with the function and rewrites
  `/api/py/*` onto it.
- **`requirements.txt`** at the root defers to `backend/requirements.txt`
  with `-r`, so deployed dependencies cannot drift from the tested ones.

### Which implementation actually answers

Both exist, and `NEXT_PUBLIC_API_BASE_URL` decides:

- **Set to `/api/py`** - the contact form and the live scorer call FastAPI.
- **Unset** - they call the Next.js route handlers instead, which run the same
  rules. The site is fully functional either way.

That fallback is why you can deploy today and worry about the Python half
later. It is also worth knowing when debugging: if the scorer behaves oddly,
check which one is answering before reading the wrong code.

---

## Environment variables

| Variable                                            | Where    | What it does                                                                      |
| --------------------------------------------------- | -------- | --------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`                              | Frontend | Canonical URLs, sitemap, robots, OG card. **Set this.**                           |
| `NEXT_PUBLIC_API_BASE_URL`                          | Frontend | `/api/py` to use FastAPI; empty to use the Next.js handlers.                      |
| `ENVIRONMENT`                                       | Function | `production` in production.                                                       |
| `SMTP_HOST` `SMTP_PORT` `SMTP_USER` `SMTP_PASSWORD` | Function | Contact delivery. **Unset means messages are logged, not sent.**                  |
| `CONTACT_TO_EMAIL`                                  | Function | Where contact messages go.                                                        |
| `CONTACT_RATE_LIMIT_PER_HOUR`                       | Function | Per-IP submissions allowed. Default 5.                                            |
| `ADMIN_PASSWORD_HASH`                               | Frontend | Admin login. Without it, `/admin` is a 404.                                       |
| `ADMIN_SESSION_SECRET`                              | Frontend | Signs the admin session. Rotating it signs everyone out.                          |
| `GITHUB_TOKEN`                                      | Frontend | Lets the panel commit content. Fine-grained, Contents read/write, this repo only. |
| `GITHUB_REPO`                                       | Frontend | `owner/repo` the panel commits to.                                                |
| `GITHUB_BRANCH`                                     | Frontend | Defaults to `main`.                                                               |

`CORS_ORIGINS` is not needed on Vercel - same origin, no preflight. It still
applies if you ever host the service separately.

`.env.example` at the repo root lists everything with comments.

**Contact messages are logged rather than emailed until SMTP is configured.**
That is deliberate, so nothing is sent by accident from a fresh deploy - but it
does mean a live site with no SMTP silently drops enquiries. Set SMTP before
sharing the link, or rely on the direct email and phone links, which always work.

One caveat specific to serverless: `CONTACT_RATE_LIMIT_PER_HOUR` counts in
process memory. Functions are per-instance and short-lived, so the limit is
best-effort rather than a real guarantee. It deters casual abuse; it is not a
security control.

---

## Post-deploy checklist

```bash
curl -s https://YOUR-DOMAIN/api/py/api/health
```

Expect `{"status":"ok"}`. If this 404s, the Python function did not build -
check the build log for the `api/index.py` step before debugging anything else.

```bash
curl -s https://YOUR-DOMAIN/robots.txt
```

```bash
curl -s https://YOUR-DOMAIN/sitemap.xml | head -20
```

- Open `https://YOUR-DOMAIN/opengraph-image` - the card should show your real
  domain in the corner, not `localhost:3000`. If it does not,
  `NEXT_PUBLIC_SITE_URL` was not set at build time.
- Paste the URL into LinkedIn's post composer and confirm the card renders.
- Run the live scorer on `/projects/ghost-transaction-detection`. A ghost
  destination should score high; a clean payment should score 0.00.
- Submit the contact form once and confirm it arrives, or appears in the
  function logs if SMTP is not configured yet.
- `https://YOUR-DOMAIN/design` should be reachable but excluded by `robots.txt`.

---

## Custom domain

Add it in Vercel → Settings → Domains, then update `NEXT_PUBLIC_SITE_URL` to
match and redeploy. Anything that embeds the URL - sitemap, OG card, JSON-LD -
is generated at build time, so the redeploy is what makes the change take.

`NEXT_PUBLIC_API_BASE_URL` needs no change: `/api/py` is relative and follows
the site wherever it lives.

---

## Hosting the service separately instead

You do not need this on Vercel. It is here because `backend/Dockerfile` keeps
the service portable, and because a reviewer reading the repo may want to run
it standalone.

```bash
docker build -t portfolio-api ./backend
```

```bash
docker run -p 8000:8000 --env-file backend/.env portfolio-api
```

Render, Railway and Fly all take that Dockerfile with the root directory set to
`backend`. If you go this route, set `NEXT_PUBLIC_API_BASE_URL` to the full
service URL, set `CORS_ORIGINS` on the service to your site's origin, and
redeploy the frontend - `NEXT_PUBLIC_*` values are inlined at build time, not
read at runtime.

Avoid free tiers that sleep. A host that takes the better part of a minute to
wake makes the live demo look broken to anyone clicking it once.
