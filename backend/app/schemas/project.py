"""Project metadata schemas.

These mirror the TypeScript types in /content/types.ts. When one side changes,
change the other — the contract test in tests/test_api.py checks the shape.
"""

from typing import Literal

from pydantic import BaseModel, Field

IdentityId = Literal[
    "data-scientist",
    "ai-engineer",
    "educator",
    "leader",
    "project-manager",
]

ProjectStatus = Literal["shipped", "in-progress", "research", "archived"]


class ProjectMetric(BaseModel):
    label: str
    #: Either a measured value or a "TODO(metric)" sentinel. The frontend
    #: renders sentinels as placeholders, never as numbers.
    value: str
    method: str | None = None
    #: A prior, misleading figure this one replaced.
    superseded: str | None = None
    #: Why the figure is qualified.
    caveat: str | None = None


class ProjectLink(BaseModel):
    label: str
    href: str
    kind: Literal["repo", "demo", "writeup", "paper", "video", "external"]


class ProjectMedia(BaseModel):
    kind: Literal["image", "video", "lottie"]
    src: str
    src_webm: str | None = Field(default=None, alias="srcWebm")
    poster: str | None = None
    alt: str
    width: int | None = None
    height: int | None = None

    model_config = {"populate_by_name": True}


class ProjectDataset(BaseModel):
    name: str
    source: str
    note: str | None = None


class Project(BaseModel):
    slug: str
    #: Display order on the projects index.
    order: int
    title: str
    tagline: str
    identities: list[IdentityId]
    summary: str
    #: What the work set out to achieve; opens the case study.
    objective: str
    problem: str | None = None
    approach: str | None = None
    #: How it was done, in method-and-tools terms.
    method: str | None = None
    outcome: str | None = None
    #: Honest next steps. Statements of intent, never claimed as done.
    next_steps: list[str] = Field(default_factory=list, alias="nextSteps")
    dataset: ProjectDataset | None = None
    motion_asset: str | None = Field(default=None, alias="motionAsset")
    stack: list[str] = Field(default_factory=list)
    metrics: list[ProjectMetric] = Field(default_factory=list)
    links: list[ProjectLink] = Field(default_factory=list)
    media: list[ProjectMedia] = Field(default_factory=list)
    status: ProjectStatus
    date: str
    started: str | None = None
    featured: bool = False
    confidentiality_note: str | None = Field(default=None, alias="confidentialityNote")
    #: Scope or validity limits shown next to the metrics, not in small print.
    caveat: str | None = None
    #: Dataset attribution, where the licence requires it.
    attribution: str | None = None

    model_config = {"populate_by_name": True}
