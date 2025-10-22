import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      borderRadius: { '2xl': '1rem' }
    }
  },
  plugins: []
} satisfies Config