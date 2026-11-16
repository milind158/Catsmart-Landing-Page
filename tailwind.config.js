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
        // The company site: light pages, dark ink, the logo's gold.
        paper: { DEFAULT: "rgb(var(--paper-rgb) / <alpha-value>)", deep: "rgb(var(--paper-deep-rgb) / <alpha-value>)" },
        surface: "rgb(var(--surface-rgb) / <alpha-value>)",
        ink: { DEFAULT: "rgb(var(--ink-rgb) / <alpha-value>)", soft: "rgb(var(--ink-soft-rgb) / <alpha-value>)", faint: "rgb(var(--ink-faint-rgb) / <alpha-value>)" },
        gold: { DEFAULT: "rgb(var(--gold-rgb) / <alpha-value>)", ink: "rgb(var(--gold-ink-rgb) / <alpha-value>)" },
        night: "rgb(var(--night-rgb) / <alpha-value>)",
        "on-night": "rgb(var(--on-night-rgb) / <alpha-value>)",
        line: "var(--color-line)",
      },
    },
  },
  plugins: [],
};
