"""Project metadata source.

Reads the JSON catalogue shipped with the service. Kept behind a function so a
later phase can swap in a database or CMS without touching the routes.
"""

import json
from functools import lru_cache
from pathlib import Path

from app.schemas.project import Project

DATA_FILE = Path(__file__).resolve().parents[2] / "data" / "projects.json"


@lru_cache
def load_projects() -> tuple[Project, ...]:
    with DATA_FILE.open(encoding="utf-8") as handle:
        raw = json.load(handle)
    return tuple(Project.model_validate(item) for item in raw)


def list_projects(identity: str | None = None, featured: bool | None = None) -> list[Project]:
    projects = list(load_projects())
    if identity:
        projects = [p for p in projects if identity in p.identities]
    if featured is not None:
        projects = [p for p in projects if p.featured is featured]
    return projects


def get_project(slug: str) -> Project | None:
    return next((p for p in load_projects() if p.slug == slug), None)
