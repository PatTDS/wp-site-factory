/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './**/*.php',
    './assets/js/**/*.js',
  ],
  theme: {
    extend: {
      colors: {
        // Replace these with your brand colors
        primary: {
          DEFAULT: '{{PRIMARY_COLOR}}',
          dark: '{{PRIMARY_COLOR_DARK}}',
          light: '{{PRIMARY_COLOR_LIGHT}}',
        },
        secondary: {
          DEFAULT: '{{SECONDARY_COLOR}}',
          dark: '{{SECONDARY_COLOR_DARK}}',
          light: '{{SECONDARY_COLOR_LIGHT}}',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['Montserrat', 'system-ui', 'sans-serif'],
      },
      container: {
        center: true,
        padding: '1rem',
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px',
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
