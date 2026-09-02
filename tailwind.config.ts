import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",

        // Academia / Classical Material Color Tokens
        mahogany: {
          DEFAULT: "#1C1714",
          dark: "#14100D",
          light: "#251E19",
        },
        "aged-oak": {
          DEFAULT: "#251E19",
          light: "#2F2721",
        },
        parchment: {
          DEFAULT: "#E8DFD4",
          light: "#F5EFE6",
          dark: "#D6CABA",
        },
        "faded-ink": "#9C8B7A",
        "worn-leather": "#3D332B",
        "wood-grain": "#4A3F35",
        brass: {
          DEFAULT: "#C9A962",
          light: "#D4B872",
          dark: "#B8953F",
        },
        crimson: {
          DEFAULT: "#8B2635",
          light: "#A62D3F",
          dark: "#6E1E2A",
        },
      },
      borderRadius: {
        DEFAULT: "4px",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        arch: "40% 40% 0 0 / 20% 20% 0 0",
      },
      fontFamily: {
        heading: ["var(--font-heading)", "'Cormorant Garamond'", "serif"],
        body: ["var(--font-sans)", "'Manrope'", "sans-serif"],
        display: ["var(--font-sans)", "'Manrope'", "sans-serif"],
        sans: ["var(--font-sans)", "'Manrope'", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
      },
      boxShadow: {
        brass: "0 4px 14px rgba(201, 169, 98, 0.25)",
        "brass-lg": "0 8px 24px rgba(201, 169, 98, 0.35)",
        crimson: "0 4px 14px rgba(139, 38, 53, 0.3)",
        engraved: "inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -1px 0 rgba(0,0,0,0.3), 0 2px 8px rgba(0,0,0,0.4)",
        "wax-seal": "inset 0 2px 4px rgba(255,255,255,0.2), inset 0 -2px 4px rgba(0,0,0,0.4), 0 4px 12px rgba(0,0,0,0.5)",
      },
    },
  },
  plugins: [],
};

export default config;
