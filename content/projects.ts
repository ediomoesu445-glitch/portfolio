import type { Project } from "./types";
import projectsData from "./data/projects.json";

// Data lives in ./data/*.json so the admin panel can read and write it.
// This module types it and is the import every page still uses.

/**
 * The six portfolio case studies.
 *
 * Every figure is transcribed from a committed result file in the source
 * repository - a CSV under `reports/`, a per-well manifest, or `REPORT.md`.
 * The machine-readable versions live in ./metrics/ and drive the charts.
 * Nothing is estimated.
 *
 * Where the project brief and the repository disagree about a detail, the
 * repository wins and the difference is flagged with a TODO, because the
 * repository is the part a reader can check.
 */
export const projects = projectsData as Project[];

export const featuredProjects = projects.filter((project) => project.featured);
