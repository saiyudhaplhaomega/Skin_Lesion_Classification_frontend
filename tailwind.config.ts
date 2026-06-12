import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Clinical teal brand (from design-specs)
        ink: {
          950: "#0D1014", // page base (dark)
          900: "#12171D",
          800: "#1A222B",
          700: "#242F3A",
        },
        teal: {
          deep: "#1A5F7A",
          bright: "#2980B2",
          glow: "#3FA7D6",
          mist: "#E8F4F8",
        },
        slate: {
          mid: "#6E7E93",
          soft: "#9AA6B4",
        },
        heat: {
          low: "#2C7FB8",
          mid: "#F5A623",
          high: "#E2574C",
        },
        status: {
          ok: "#4CAF8E",
          warn: "#E3B341",
          alert: "#E2574C",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "sans-serif",
        ],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      borderRadius: {
        glass: "1.25rem",
      },
      boxShadow: {
        glass: "0 8px 32px rgba(13, 16, 20, 0.45)",
        "glow-teal": "0 0 48px rgba(41, 128, 178, 0.25)",
      },
      backgroundImage: {
        "radial-fade":
          "radial-gradient(ellipse at center, rgba(41,128,178,0.18), transparent 70%)",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
