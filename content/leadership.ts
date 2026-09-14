import type { Affiliation, LeadershipRole } from "./types";
import affiliationsData from "./data/affiliations.json";
import leadershipData from "./data/leadership-roles.json";

// Data lives in ./data/*.json so the admin panel can read and write it.
// This module types it and is the import every page still uses.

/**
 * Leadership, convening and delivery roles, drawn from the CV and ordered
 * newest first. The outcomes here are specific on purpose: a leadership
 * section that lists offices without saying what changed is unassessable.
 */
export const leadershipRoles = leadershipData as LeadershipRole[];
export const affiliations = affiliationsData as Affiliation[];
