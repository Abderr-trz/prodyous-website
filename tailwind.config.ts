import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      screens: {
        xs: '375px',
      },
      colors: {
        background: "#0a0a0a",
        foreground: "#ffffff",
        accent: {
          DEFAULT: "#FFD700",
          dim: "#b89b1a",
        },
        muted: {
          DEFAULT: "#1a1a1a",
          foreground: "#888888",
        },
        card: {
          DEFAULT: "#111111",
          foreground: "#ffffff",
        },
        border: "#222222",
        input: "#1a1a1a",
      },
      fontFamily: {
        oswald: ["var(--font-oswald)", "sans-serif"],
        inter: ["var(--font-inter)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
