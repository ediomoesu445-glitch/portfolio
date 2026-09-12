from fastapi import APIRouter, HTTPException, Query

from app.schemas.project import Project
from app.services import projects as service

router = APIRouter(prefix="/projects", tags=["projects"])


@router.get("", response_model=list[Project], summary="List projects")
def list_projects(
    identity: str | None = Query(
        default=None,
        description="Filter by identity id, e.g. 'data-scientist'.",
    ),
    featured: bool | None = Query(default=None),
) -> list[Project]:
    return service.list_projects(identity=identity, featured=featured)


@router.get("/{slug}", response_model=Project, summary="Get one project")
def get_project(slug: str) -> Project:
    project = service.get_project(slug)
    if project is None:
        raise HTTPException(status_code=404, detail=f"No project with slug '{slug}'")
    return project
