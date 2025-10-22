import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#111111',
          accent: '#e11d48', // 강한 레드 포인트
          dim: '#0a0a0a'
        }
      },
      fontFamily: {
        display: ['Oswald', 'ui-sans-serif', 'system-ui'] // 콘덴스드 무드
      },
      borderRadius: { '2xl': '1rem' }
    }
  },
  plugins: []
} satisfies Config
