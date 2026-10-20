import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: {
          light: "#F6F5F0",
          dark: "#111317",
          deep: "#0B0C0E",
        },
        surface: {
          dark: "#1A1D24",
          darker: "#14171E",
          card: "#FFFFFF",
          subtle: "#F9F8F5",
        },
        primary: {
          DEFAULT: "#D96B27",
          hover: "#B8561B",
          light: "#FFF4ED",
        },
        secondary: {
          DEFAULT: "#15803D",
          hover: "#166534",
          badge: "#DCFCE7",
        },
        border: {
          light: "#E2E0D8",
          dark: "#2A2E39",
          amber: "#D96B27",
        },
        content: {
          dark: "#111317",
          muted: "#525866",
          light: "#F3F4F6",
          lightMuted: "#9CA3AF",
        },
      },
      fontFamily: {
        heading: ["var(--font-heading)", "Plus Jakarta Sans", "sans-serif"],
        body: ["var(--font-body)", "Inter", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
        arabic: ["var(--font-arabic)", "IBM Plex Sans Arabic", "sans-serif"],
      },
      borderRadius: {
        sm: "2px",
        DEFAULT: "4px",
        md: "6px",
        lg: "8px",
      },
    },
  },
  plugins: [],
};

export default config;
