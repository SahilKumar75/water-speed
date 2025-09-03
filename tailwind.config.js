/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    'from-green-400', 'to-cyan-400', 'bg-gradient-to-r', 'bg-clip-text', 'text-transparent',
    'from-accent', 'to-bg'
  ],
  theme: {
    extend: {
      colors: {
        bg: '#ecf4ef',
        accent: '#c0e57b',
        dark: '#224b32',
        green: '#43D8C9',
        cyan: '#38bdf8',
        yellow: '#FEE440',
        white: '#F4F4F9',
        gray: '#E7E7E7',
        primary: '#ecf4ef',
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
    },
  },
  plugins: [],
}
