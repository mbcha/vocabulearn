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
        'palette': 'linear-gradient(to right, #f43f5e, #ec4899, #d946ef, #a855f7, #8b5cf6, #6366f1, #3b82f6, #0ea5e9, #06b6d4, #14b8a6, #10b981, #22c55e, #84cc16, #eab308, #f59e0b, #f97316, #ef4444)',
        'palette-2': 'linear-gradient(to right, #f3f4f6, #fff, #d1d5db, #737373, #6b7280, #64748b, #000)',
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
