import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#120f1e',
        gold: '#d6b36a',
        violet: '#8167ff'
      },
      boxShadow: { soft: '0 20px 70px rgba(16, 12, 36, .18)' }
    }
  },
  plugins: []
};
export default config;
