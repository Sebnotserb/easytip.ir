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
        primary: "#6BCF9C",
        "primary-dark": "#4AB87E",
        secondary: "#E8F7EF",
        accent: "#F59E0B",
        "accent-light": "#FEF3C7",
        cta: "#1A8D4F",
        "cta-hover": "#15713F",
        dark: "#111827",
        muted: "#6B7280",
      },
      fontFamily: {
        vazir: ["Vazirmatn", "sans-serif"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        "card-sm": "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
        card: "0 4px 16px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04)",
        "card-lg": "0 10px 30px rgba(0,0,0,0.10), 0 4px 6px rgba(0,0,0,0.04)",
        glow: "0 0 20px rgba(107,207,156,0.25)",
      },
    },
  },
  plugins: [],
};

export default config;
