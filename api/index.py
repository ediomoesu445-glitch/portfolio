"""Vercel entrypoint for the FastAPI service.

The site and the API deploy together from this one repo: Vercel builds the
Next.js app as usual and this file as a Python serverless function, so a single
`vercel --prod` ships both. There is no second host, no second deploy and no
CORS, because the API ends up on the same origin as the site.

Why the mount rather than exporting `app.main:app` directly: the Next.js app
already owns `/api/contact` and `/api/ml/predict` through its own route
handlers. Serving FastAPI at those same paths would be a collision, so the
whole service is mounted one level down at `/api/py`. The public path for the
contact endpoint is therefore:

    /api/py  +  /api/contact  ->  /api/py/api/contact

which is what NEXT_PUBLIC_API_BASE_URL=/api/py produces in lib/api.ts. The
doubled segment is ugly and entirely internal; nothing links to it by hand.

Local development does not use this file. Run the service directly instead:
    cd backend && uvicorn app.main:app --reload
"""

import pathlib
import sys

# The service lives in backend/, which is not on the path when Vercel loads a
# function from api/. vercel.json's includeFiles is what ships the directory.
BACKEND = pathlib.Path(__file__).resolve().parent.parent / "backend"
sys.path.insert(0, str(BACKEND))

from fastapi import FastAPI  # noqa: E402

from app.main import app as service  # noqa: E402

app = FastAPI(docs_url=None, redoc_url=None, openapi_url=None)
app.mount("/api/py", service)
