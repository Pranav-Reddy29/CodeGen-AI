/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'fade-in-up': 'fadeInUp 1s cubic-bezier(0.4, 0, 0.2, 1) both',
        'fade-in': 'fadeIn 1.2s cubic-bezier(0.4, 0, 0.2, 1) both',
        'dropdown-pop': 'dropdownPop 0.2s cubic-bezier(0.4, 0, 0.2, 1) both',
        'gradient-x': 'gradientX 3s ease-in-out infinite',
        'pop-fade': 'popFadeIn 1s cubic-bezier(0.4, 0, 0.2, 1) both',
        'slide-in': 'slideInRight 0.3s cubic-bezier(0.4,0,0.2,1) both',
      },
      keyframes: {
        fadeInUp: {
          'from': { opacity: '0', transform: 'translateY(40px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          'from': { opacity: '0' },
          'to': { opacity: '1' },
        },
        gradientX: {
          '0%, 100%': { backgroundPosition: 'left center' },
          '50%': { backgroundPosition: 'right center' },
        },
        popFadeIn: {
          '0%': { opacity: '0', transform: 'translateY(40px) scale(0.95)' },
          '60%': { opacity: '1', transform: 'translateY(-8px) scale(1.05)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        slideInRight: {
          'from': { transform: 'translateX(100%)', opacity: '0' },
          'to': { transform: 'translateX(0)', opacity: '1' },
        },
        dropdownPop: {
          '0%': { opacity: '0', transform: 'scale(0.95) translateY(-5px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}