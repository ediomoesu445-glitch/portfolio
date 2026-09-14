import type { Certification, EducationItem } from "./types";
import certificationsData from "./data/certifications.json";
import educationData from "./data/education.json";

// Data lives in ./data/*.json so the admin panel can read and write it.
// This module types it and is the import every page still uses.

export const education = educationData as EducationItem[];
export const certifications = certificationsData as Certification[];
