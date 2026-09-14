import type { TeachingContent } from "./types";
import teachingData from "./data/teaching.json";

// Data lives in ./data/*.json so the admin panel can read and write it.
// This module types it and is the import every page still uses.

/**
 * The educator identity, from the CV. Subjects, clubs and mentorship are real;
 * cohort sizes and outcomes are marked TODO because they are the figures a
 * school will actually ask about and they are not in the CV.
 */
export const teaching = teachingData as TeachingContent;
