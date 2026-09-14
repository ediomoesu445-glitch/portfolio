import type { ExperienceItem } from "./types";
import experienceData from "./data/experience.json";

// Data lives in ./data/*.json so the admin panel can read and write it.
// This module types it and is the import every page still uses.

/** Ordered newest-first. Dates are ISO YYYY-MM, taken from the CVs. */
export const experience = experienceData as ExperienceItem[];
