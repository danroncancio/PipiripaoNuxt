module.exports = {
  content: [],
  theme: {
    extend: {
      fontFamily: {
        polly: ["Polly", "sans-serif"],
        "polly-bold": ["PollyBold", "sans-serif"],
      },
      screens: {
        "3xl": "1792px",
        "4xl": "2560px",
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
  daisyui: {
    themes: [
      {
        pipiripao: {
          primary: "#8B575C",
          secondary: "#B2A7A1",
          accent: "#85ADAC",
          neutral: "#000",
          "base-100": "#FFFDF5",
          info: "#155e75",
          success: "#059669",
          warning: "#eab308",
          error: "#c2410c",
        },
      },
    ],
  },
};
