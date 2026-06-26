const nativewind = require("nativewind/preset");
const { Colors, Radius } = require("./constants/tokens");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./features/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [nativewind],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: Colors.primary.DEFAULT,
          hover:   Colors.primary.hover,
          light:   Colors.primary.light,
          muted:   Colors.primary.muted,
        },
        error: {
          DEFAULT: Colors.error.DEFAULT,
          hover:   Colors.error.hover,
          light:   Colors.error.light,
        },
        success: {
          DEFAULT: Colors.success.DEFAULT,
          hover:   Colors.success.hover,
          light:   Colors.success.light,
        },
        warning: {
          DEFAULT: Colors.warning.DEFAULT,
          hover:   Colors.warning.hover,
          light:   Colors.warning.light,
        },
      },
      borderRadius: {
        sm: `${Radius.sm}px`,
        md: `${Radius.md}px`,
        lg: `${Radius.lg}px`,
        xl: `${Radius.xl}px`,
      },
    },
  },
  plugins: [],
};
