import { ImageResponse } from "next/og";

export const runtime = "edge";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f9fafb",
          color: "#1f2937",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div style={{ fontSize: 56, fontWeight: 700 }}>Skin Lesion AI</div>
        <div style={{ fontSize: 28, color: "#4b5563", marginTop: 18 }}>
          Educational Monitoring Platform
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
