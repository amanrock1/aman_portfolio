import type { Config } from "tailwindcss";

// "Paper & Ink" design tokens. Colours are CSS variables (space-separated RGB) defined in
// globals.css, so every utility and the `/opacity` modifier work. Values mirror the Stitch design system (project 4009013806429311034).
const rgb = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

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
          DEFAULT: rgb("paper"),
          raised: rgb("paper-raised"),
          sunk: rgb("paper-sunk"),
        },
        hairline: rgb("hairline"),
        ink: {
          DEFAULT: rgb("ink"),
          soft: rgb("ink-soft"),
          faint: rgb("ink-faint"),
        },
        vermilion: {
          DEFAULT: rgb("vermilion"),
          dark: rgb("vermilion-dark"),
        },
        signal: rgb("signal"),
        mustard: rgb("mustard"),
        tape: rgb("tape"),
      },
      borderRadius: {
        DEFAULT: "4px",
      },
      boxShadow: {
        press: "3px 3px 0 0 rgb(var(--shadow))",
        "press-sm": "2px 2px 0 0 rgb(var(--shadow))",
        "press-in": "1px 1px 0 0 rgb(var(--shadow))",
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
