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
        canvas:   'var(--color-canvas)',
        surface1: 'var(--color-surface1)',
        surface2: 'var(--color-surface2)',
        surface3: 'var(--color-surface3)',
        border:   'var(--color-border)',
        text:     'var(--color-text)',
        muted:    'var(--color-muted)',
        primary:  '#6366f1',
        secondary: '#06b6d4',
      },
      maxWidth: {
        content: '1280px',
      },
    },
  },
  plugins: [forms],
}