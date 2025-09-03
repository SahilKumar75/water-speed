/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
        colors: {
          dashboard: {
            bg: '#ecf4ef',
            accent: '#c0e57b',
            dark: '#224b32',
            green: '#43D8C9',
            cyan: '#38bdf8',
            yellow: '#FEE440',
            white: '#F4F4F9',
            gray: '#E7E7E7',
          },
          primary: '#ecf4ef',
          accent: '#c0e57b',
          dark: '#224b32',
          green: '#43D8C9',
          cyan: '#38bdf8',
          yellow: '#FEE440',
          white: '#F4F4F9',
          gray: '#E7E7E7',
        },
      animation: {
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      }
    },
  },
  plugins: [],
}
