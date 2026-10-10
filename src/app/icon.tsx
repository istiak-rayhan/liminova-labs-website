import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
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
            left: 6,
            bottom: 6,
            width: 7,
            height: 18,
            background: "#10b981",
            borderRadius: 2,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 6,
            bottom: 6,
            width: 16,
            height: 7,
            background: "#10b981",
            borderRadius: 2,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 6,
            right: 6,
            width: 5,
            height: 5,
            background: "#2dd4bf",
            transform: "rotate(45deg)",
          }}
        />
      </div>
    ),
    { ...size },
  );
}
