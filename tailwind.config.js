// tailwind.config.js
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        light: {
          primary: "#63EB25",
          secondary: "#2563EB",
          accent: "#EB2563",
          neutral: "#171717",
          "base-100": "#ffffff",
          "base-content": "#171717",
        },
      },
      {
        dark: {
          primary: "#63EB25",
          secondary: "#2563EB",
          accent: "#EB2563",
          neutral: "#e5e5e5",
          "base-100": "#171717",
          "base-content": "#ffffff",
        },
      },
    ],
  },
};
