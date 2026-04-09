import forms from '@tailwindcss/forms'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sora: ['Sora', 'sans-serif'],
        dm: ['DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        canvas:    '#0a0a0f',
        surface1:  '#0f172a',
        surface2:  '#111827',
        surface3:  '#1e293b',
        primary:   '#6366f1',
        secondary: '#06b6d4',
      },
      maxWidth: {
        content: '1280px',
      },
    },
  },
  plugins: [forms],
}