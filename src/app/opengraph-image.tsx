import { ImageResponse } from "next/og";

export const alt = "Liminova Labs — digital transformation partner";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f8fafc",
          padding: 72,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            color: "#0f172a",
            fontSize: 28,
            fontWeight: 700,
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              background: "#10b981",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 12,
              fontSize: 28,
            }}
          >
            L
          </div>
          Liminova Labs
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 20,
            maxWidth: 900,
          }}
        >
          <div
            style={{
              fontSize: 58,
              fontWeight: 800,
              color: "#0f172a",
              lineHeight: 1.15,
            }}
          >
            We design, ship, and grow product platforms.
          </div>
          <div style={{ fontSize: 28, color: "#475569" }}>
            Flutter · Next.js · SEO & Meta Ads · Dhaka, serving globally
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
