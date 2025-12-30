/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#FAFAF9', // Stone-50
        foreground: '#0F172A', // Slate-900
        muted: '#F5F5F4', // Stone-100
        'muted-foreground': '#78716C', // Stone-500
        primary: '#8DA399', // Sage Green
        'primary-foreground': '#FFFFFF',
        secondary: '#E7E5E4', // Stone-200
        accent: '#D6D3D1', // Stone-300
        card: '#FFFFFF',
        'card-foreground': '#0F172A', // Slate-900
        border: '#E7E5E4', // Stone-200
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        lg: '1rem',
        md: '0.75rem',
        sm: '0.5rem',
      },
    },
  },
  plugins: [],
}
