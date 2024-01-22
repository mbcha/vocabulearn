import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";
import colors from "tailwindcss/colors";

console.log('colors', colors)

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      backgroundImage: {
        'i-inherit': "inherit",
        'color-hue': 'linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #ffffff, #0000ff, #ff00ff, #ff0000, #000000)',
        'gradient': 'linear-gradient(to right, var(--color-primary), var(--color-secondary))',
      },
      backgroundColor: {
        'primary': 'var(--color-primary)',
        'secondary': 'var(--color-secondary)',
      },
      textColor: {
        'primary': 'var(--color-primary)',
        'secondary': 'var(--color-secondary)',
      },
      borderColor: {
        'primary': 'var(--color-primary)',
        'secondary': 'var(--color-secondary)',
      },
    },
  },
  plugins: [],
} satisfies Config;
