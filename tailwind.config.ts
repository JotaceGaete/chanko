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
        verde: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
        },
        tierra: {
          50: "#fdf8f0",
          100: "#faefd8",
          200: "#f5ddb0",
          300: "#edc478",
          400: "#e4a645",
          500: "#d4892a",
          600: "#b86d1f",
          700: "#975219",
          800: "#7a4118",
          900: "#643618",
        },
      },
    },
  },
  plugins: [],
};
export default config;
