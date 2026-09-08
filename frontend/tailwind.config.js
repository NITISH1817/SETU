/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Legacy gov palette
        gov: {
          navy:    '#0A192F',
          blue:    '#1E3A8A',
          gold:    '#D97706',
          slate:   '#334155',
          light:   '#F8FAFC',
          card:    '#0F172A',
          emerald: '#059669',
          amber:   '#D97706'
        },
        // CSS-var-based semantic tokens (theme-aware)
        gc: {
          bg:       'var(--bg)',
          surface:  'var(--surface)',
          surface2: 'var(--surface-2)',
          surface3: 'var(--surface-3)',
          border:   'var(--border)',
          border2:  'var(--border-2)',
          text:     'var(--text)',
          muted:    'var(--text-muted)',
          dim:      'var(--text-dim)',
          primary:  'var(--primary)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
