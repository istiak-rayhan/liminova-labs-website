import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#ffffff",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 36,
            bottom: 36,
            width: 40,
            height: 100,
            background: "#10b981",
            borderRadius: 12,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 36,
            bottom: 36,
            width: 90,
            height: 40,
            background: "#10b981",
            borderRadius: 12,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 32,
            right: 36,
            width: 22,
            height: 22,
            background: "#2dd4bf",
            transform: "rotate(45deg)",
          }}
        />
      </div>
    ),
    { ...size },
  );
}
