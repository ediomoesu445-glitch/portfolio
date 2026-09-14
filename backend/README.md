# Portfolio API

FastAPI service backing the portfolio: project metadata, contact handling, and
the live ML demo (Phase 6).

## Run

```bash
python -m venv .venv && source .venv/Scripts/activate && pip install -r requirements-dev.txt
```

On macOS/Linux the activate path is `.venv/bin/activate`.

```bash
uvicorn app.main:app --reload --port 8000
```

Docs: http://localhost:8000/docs

## Test

```bash
pytest
```

## Layout

- `app/main.py` - application, CORS, router mounting
- `app/core/config.py` - settings from environment / `.env`
- `app/api/routes/` - one module per resource
- `app/schemas/` - Pydantic contracts, mirroring `/content/types.ts`
- `app/services/` - data access and side effects, kept out of the routes
- `data/projects.json` - project catalogue

## Notes

- Contact messages are logged rather than emailed unless SMTP is configured.
- `POST /api/ml/predict` returns **501** until the Phase 6 model lands; the
  request/response schema is already fixed so the frontend can be built now.
