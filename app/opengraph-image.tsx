import { ImageResponse } from "next/og";
import { profile } from "@/content/profile";

export const alt = `${profile.name} - ${profile.headline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * The card that appears when a link to this site is pasted anywhere.
 *
 * Generated rather than designed by hand, so it cannot drift from the content,
 * and drawn in the Control Room palette: a desaturated field, one teal rule,
 * and no decoration. Rendered at build time - no network fetches, no fonts to
 * download, so it cannot fail a deploy.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "#14181c",
        padding: "72px 80px",
      }}
    >
      {/* Instrument rule */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ width: 56, height: 3, backgroundColor: "#46908c" }} />
        <div
          style={{
            fontSize: 22,
            letterSpacing: 4,
            color: "#8c99a4",
            textTransform: "uppercase",
          }}
        >
          {`${profile.location} · ${profile.availability}`}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            fontSize: 92,
            fontWeight: 700,
            color: "#e6eaee",
            letterSpacing: -3,
            lineHeight: 1.02,
          }}
        >
          {profile.name}
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 32,
            color: "#8c99a4",
            lineHeight: 1.35,
            maxWidth: 960,
          }}
        >
          Energy-sector analytics, machine learning and computer vision - with the
          number I can defend, not the flattering one.
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: "1px solid #2b333b",
          paddingTop: 28,
          fontSize: 24,
          color: "#6b7883",
        }}
      >
        <div style={{ display: "flex" }}>
          Researcher · Data Scientist · AI/ML Engineer · Educator
        </div>
        <div style={{ display: "flex", color: "#46908c" }}>{siteHost()}</div>
      </div>
    </div>,
    size,
  );
}

/** The bare host, so the card reads as a place rather than a URL. */
function siteHost() {
  try {
    return new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").host;
  } catch {
    return "";
  }
}
