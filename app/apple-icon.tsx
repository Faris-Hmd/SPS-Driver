import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "44px",
      }}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        width="130"
        height="130"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Car Body Shell */}
        <path d="M19 17h1a2 2 0 0 0 2-2v-3c0-1.1-.9-2-2-2h-1.59a2 2 0 0 1-1.74-1.02l-1.04-1.8A3 3 0 0 0 13 5.6H8a3 3 0 0 0-2.6 1.5l-1.04 1.8A2 2 0 0 1 2.62 10H2a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h1" />

        {/* Wheels */}
        <circle cx="6.5" cy="17.5" r="2.5" fill="white" />
        <circle cx="17.5" cy="17.5" r="2.5" fill="white" />

        {/* Window/Cabin Detail */}
        <path
          d="M14 9H10a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1z"
          opacity="0.5"
        />
      </svg>
    </div>,
    {
      ...size,
    },
  );
}
