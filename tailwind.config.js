/** @type {import('tailwindcss').Config} */
module.exports = {
   content: [
      './pages/**/*.{js,ts,jsx,tsx,mdx}',
      './components/**/*.{js,ts,jsx,tsx,mdx}',
      './app/**/*.{js,ts,jsx,tsx,mdx}',
   ],
   options: {
      safelist: ['dark-theme', 'light-theme'],
   },
   theme: {
      extend: {
         fontFamily: {
            roboto: ['Roboto', 'sans-serif'],
         },
         colors: {
            primary: {
               DEFAULT: '#FF8900',
            },
            secondary: {
               DEFAULT: '#607EE9',
            },
            tertiary: {
               DEFAULT: '#F3F2F7',
            },
            title: {
               DEFAULT: '#232323',
            },
            text: {
               DEFAULT: '#7A7A7A',
            },
            background: {
               DEFAULT: '#FBFBFB',
            },
            blackBackground: {
               DEFAULT: '#2C2C2C',
            },
            input__background: {
               DEFAULT: '#F4F4F4',
            },
            borderLines: {
               DEFAULT: '#B6B6B6',
            },
            redBtn: {
               DEFAULT: '#FF2D2D',
            },
         },
         backgroundImage: {
            'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
            'gradient-conic':
               'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
         },
      },
   },
   plugins: [],
};
