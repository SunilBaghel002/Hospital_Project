/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-cream': '#F8F5F2', // Soft Cream
        'brand-peach': '#FFDAB9', // Light Peach
        'brand-blue': '#0891b2', // Medical Cyan (Renamed conceptually but keeping key for compatibility)
        'brand-dark': '#2D3748',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' },
        }
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'marquee': 'marquee 50s linear infinite',
      },
    },
  },
  plugins: [],
}
