/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'], // Add your custom font here
      },
      boxShadow: {
        'custom': '0px 80px 48px -24px rgba(202, 220, 239, 1)'
      }
    }
  },
  plugins: []
};
