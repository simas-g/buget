module.exports = {
  content: ["@/components/**/*"],
  theme: {
    extend: {
      colors: {
        bgreen: "var(--color-bgreen)",
        bblue: "var(--color-bblue)",
        bred: "var(--color-bred)",
      },
      fontFamily: {
        sans: ["var(--font-roboto)"],
        heading: ["var(--font-inter)"],
      },
    },
  },
};
