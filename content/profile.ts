import type { Profile } from "./types";
import profileData from "./data/profile.json";

// Data lives in ./data/*.json so the admin panel can read and write it.
// This module types it and is the import every page still uses.

export const profile = profileData as Profile;
