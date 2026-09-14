import type { ResearchFinding } from "./types";
import findingsData from "./data/research-findings.json";
import stanceData from "./data/research-stance.json";

// Data lives in ./data/*.json so the admin panel can read and write it.
// This module types it and is the import every page still uses.

/**
 * The research through-line.
 *
 * Every project on this site produced a finding about *method* as well as a
 * model - usually a finding that made the headline number smaller. Collected
 * here because that pattern is the actual claim of the researcher identity,
 * and it is only visible when the findings sit together.
 *
 * Each entry is sourced from the same committed result files the case studies
 * use. Nothing here is a summary of a summary.
 */
export const researchFindings = findingsData as ResearchFinding[];
export const researchStance = stanceData;
