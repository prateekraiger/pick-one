import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
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
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
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
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        paper: {
          50: "#fefaf3",
          100: "#fdf3e2",
          200: "#f8e5c0",
          300: "#f0d29a",
          400: "#e5b56a",
          500: "#d99a44",
          600: "#c17f30",
          700: "#9c6427",
          800: "#7d5024",
          900: "#674220",
        },
        bowl: {
          light: "#c9895a",
          DEFAULT: "#a8663c",
          dark: "#7a4728",
          rim: "#e8b785",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        handwriting: ["var(--font-caveat)", "cursive"],
        handwriting2: ["var(--font-kalam)", "cursive"],
        sans: ["var(--font-nunito)", "system-ui", "sans-serif"],
      },
      keyframes: {
        wiggle: {
          "0%, 100%": { transform: "rotate(-1.5deg)" },
          "50%": { transform: "rotate(1.5deg)" },
        },
        "shake-bowl": {
          "0%, 100%": { transform: "translateX(0) rotate(0deg)" },
          "10%": { transform: "translateX(-6px) rotate(-3deg)" },
          "20%": { transform: "translateX(6px) rotate(3deg)" },
          "30%": { transform: "translateX(-8px) rotate(-4deg)" },
          "40%": { transform: "translateX(8px) rotate(4deg)" },
          "50%": { transform: "translateX(-6px) rotate(-3deg)" },
          "60%": { transform: "translateX(6px) rotate(3deg)" },
          "70%": { transform: "translateX(-4px) rotate(-2deg)" },
          "80%": { transform: "translateX(4px) rotate(2deg)" },
          "90%": { transform: "translateX(-2px) rotate(-1deg)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
      animation: {
        wiggle: "wiggle 0.3s ease-in-out infinite",
        "shake-bowl": "shake-bowl 1.5s ease-in-out",
        "float-slow": "float-slow 4s ease-in-out infinite",
      },
      boxShadow: {
        paper: "2px 3px 8px rgba(120, 80, 40, 0.18)",
        "paper-hover": "3px 5px 14px rgba(120, 80, 40, 0.28)",
        bowl: "0 20px 50px rgba(90, 55, 25, 0.35)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
