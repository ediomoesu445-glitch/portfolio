import type { Identity } from "./types";
import identitiesData from "./data/identities.json";

// Data lives in ./data/*.json so the admin panel can read and write it.
// This module types it and is the import every page still uses.

/**
 * The six identities the whole site is organised around. Order matters: it
 * drives nav order, the identity switcher and the default project sort.
 */
export const identities = identitiesData as Identity[];

export const identityById = Object.fromEntries(
  identities.map((identity) => [identity.id, identity]),
) as Record<Identity["id"], Identity>;
