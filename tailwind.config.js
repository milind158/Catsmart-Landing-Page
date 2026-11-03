export default {
  future: { hoverOnlyWhenSupported: true },
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter Variable", "system-ui", "sans-serif"],
        // Quoted: a family name containing a number is invalid CSS without quotes.
        serif: ['"Source Serif 4 Variable"', "Georgia", "serif"],
      },
      colors: {
        navy: "var(--color-navy)",
        studio: "var(--color-studio)",
        ivory: "rgb(var(--color-ivory-rgb) / <alpha-value>)",
        brass: { DEFAULT: "var(--color-brass)", dark: "var(--color-brass-dark)" },
        "on-navy": "var(--color-body-on-navy)",
        "on-ivory": "var(--color-body-on-ivory)",
        "line-navy": "var(--color-line-on-navy)",
        "line-ivory": "var(--color-line-on-ivory)",
        muted: { foreground: "hsl(var(--muted-foreground))" },
      },
    },
  },
  plugins: [],
};
