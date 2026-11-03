export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter Variable", "system-ui", "sans-serif"],
        serif: ["Source Serif 4 Variable", "Georgia", "serif"],
      },
      colors: {
        muted: { foreground: "hsl(var(--muted-foreground))" },
      },
    },
  },
  plugins: [],
};
