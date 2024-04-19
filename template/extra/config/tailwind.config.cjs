import plugin from "tailwindcss/plugin";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],

  theme: {
    screens: {
      md: { max: "764px" },
    },
    extend: {
      colors: {
        primaryColor: "#3498db",
        secondaryColor: "#e74c3c",
        backgroundColor: "#ffffff",
        foregroundColor: "#000000",
        dangerColor: "#ff0000",
        successColor: "#27cf22",
        mutedColor: "#505050",
      },
      borderRadius: {
        bdr: "0.3rem",
      },
      fontFamily: {
        headingFont: "Arial, Helvetica, sans-serif",
        bodyFont: "Verdana, Geneva, Tahoma, sans-serif",
      },
      fontSize: {
        huge: "clamp(3.8rem, calc(3.8rem + ((1vw - 0.48rem) * 1.3889)), 4.8rem)",
        h1: "clamp(2.8rem, calc(2.8rem + ((1vw - 0.48rem) * 1.3889)), 3.8rem)",
        h2: "clamp(2rem, calc(2rem + ((1vw - 0.48rem) * 1.3889)), 3rem)",
        h3: "clamp(1.5rem, calc(1.5rem + ((1vw - 0.48rem) * 0.5208)), 1.875rem)",
        h4: "clamp(1.125rem, calc(1.125rem + ((1vw - 0.48rem) * 0.3472)), 1.375rem)",
        body: "clamp(1rem, calc(1rem + ((1vw - 0.48rem) * 0.1736)), 1.125rem)",
        small:
          "clamp(0.875rem, calc(0.875rem + ((1vw - 0.48rem) * 0.1736)), 1rem)",
      },
      lineHeight: {
        lh1: 1.3,
        lh2: 1.35,
        lh3: 1.4,
        lh4: 1.5,
        lhbody: 1.6,
      },
    },
  },
  plugins: [
    plugin(({ addBase, theme }) => {
      addBase({
        h1: {
          fontSize: theme("fontSize.h1"),
          lineHeight: theme("lineHeight.lh1"),
        },
        h2: {
          fontSize: theme("fontSize.h2"),
          lineHeight: theme("lineHeight.lh2"),
        },
        h3: {
          fontSize: theme("fontSize.h3"),
          lineHeight: theme("lineHeight.lh3"),
        },
        h4: {
          fontSize: theme("fontSize.h4"),
          lineHeight: theme("lineHeight.lh4"),
        },
        "label, code, span, li, p, i": {
          fontFamily: theme("fontFamily.bodyFont"),
          fontSize: theme("fontSize.body"),
          fontWeight: "400",
          lineHeight: theme("lineHeight.lhbody"),
        },
        "h1,h2,h3,h4": {
          fontFamily: theme("fontFamily.headingFont"),
          fontWeight: "700",
        },
      });
    }),
  ],
};
