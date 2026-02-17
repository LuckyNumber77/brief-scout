import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0a0a0f",
        card: "#1a1a24",
        border: "rgba(255, 255, 255, 0.1)",
        accent: "#3b82f6",
        success: "#10b981",
        warning: "#f59e0b",
      },
      backdropBlur: {
        xl: "20px",
      },
    },
  },
  plugins: [],
};
export default config;
