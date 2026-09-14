import aboutData from "./data/about.json";

// Data lives in ./data/*.json so the admin panel can read and write it.
// This module types it and is the import every page still uses.

/**
 * The narrative bio. The personal paragraph is Ediomo's own words, from the
 * Europass CV; the rest is drawn from the professional summary.
 *
 * Includes `context`: factual background on the regulator, for readers
 * outside Nigerian energy.
 */
export const about = aboutData;
