import type { Config } from "tailwindcss";

// "Paper & Ink" design tokens. Values mirror the Stitch design system
// (project 4009013806429311034) so code and designs stay in sync.
const config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      colors: {
        paper: {
          DEFAULT: "#F4EFE6",
          raised: "#FBF8F2",
          sunk: "#ECE6DA",
        },
        hairline: "#D9D1C2",
        ink: {
          DEFAULT: "#1F2A37",
          soft: "#5B6472",
          faint: "#8A8F98",
        },
        vermilion: {
          DEFAULT: "#C8452B",
          dark: "#A62D15",
          100: "#F6DCD4",
          200: "#EDB3A4",
          300: "#E08A74",
          400: "#D46448",
        },
        signal: "#2F6F5E",
        mustard: "#D9A441",
      },
      borderRadius: {
        DEFAULT: "4px",
      },
      boxShadow: {
        press: "3px 3px 0 0 #1F2A37",
        "press-sm": "2px 2px 0 0 #1F2A37",
        "press-in": "1px 1px 0 0 #1F2A37",
      },
      maxWidth: {
        page: "1440px",
        prose: "68ch",
      },
      keyframes: {
        blink: { "0%, 49%": { opacity: "1" }, "50%, 100%": { opacity: "0" } },
        eq: { "0%, 100%": { transform: "scaleY(0.3)" }, "50%": { transform: "scaleY(1)" } },
        rise: {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        blink: "blink 1s steps(1) infinite",
        eq: "eq 0.9s ease-in-out infinite",
        rise: "rise 0.4s ease-out both",
      },
    },
  },
  plugins: [],
} satisfies Config;

export default config;
