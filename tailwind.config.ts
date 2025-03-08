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
        white: "#FFFFFF",
        gray1: "#F5F5F5",
        gray2: "#D9D9D9",
        gray3: "#C4C4C4",
        gray4: "#8E8E8E",
        gray5: "#5F5F5F",
        black: "#000000",
        "bg-primary": "#8EB486",
        "bg-primary2": "#A8C8A2",
        "bg-primary3": "#5E7A58",
        "btn-primary": "#72BF78",
        "primary-darkmode": "#C2FFC7",
        red1: "#FF0000",
        yellow1: "#FEE500",
        green1: "#A8EA8C",
      },
      boxShadow: {
        top: "0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 -2px 4px -1px rgba(0, 0, 0, 0.06)",
        bottom: "0px 4px 4px rgba(0, 0, 0, 0.25)",
      },
      fontFamily: {
        sans: ["var(--font-pretendard)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
