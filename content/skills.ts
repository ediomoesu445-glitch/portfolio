import type { SkillGroup } from "./types";
import languagesData from "./data/languages.json";
import skillGroupsData from "./data/skill-groups.json";

// Data lives in ./data/*.json so the admin panel can read and write it.
// This module types it and is the import every page still uses.

export const skillGroups = skillGroupsData as SkillGroup[];
export const languages = languagesData;
