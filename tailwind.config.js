export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: { sans: ["Inter", "system-ui", "sans-serif"] },
      colors: {
        muted: { foreground: "hsl(var(--muted-foreground))" },
      },
    },
  },
  plugins: [],
};
