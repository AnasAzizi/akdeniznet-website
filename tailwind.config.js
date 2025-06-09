module.exports = {
  content: [
    "./*.html",
    "./js/**/*.js",
    "./src/**/*.{html,js}"
  ],
  theme: {
    screens: {
      sm: '480px',
      md: '768px',
      lg: '976px',
      xl: '1440px',
    },
    extend: {
      fontFamily: {
        sans: ['Josefin Sans', 'sans-serif'],
        alata: ['Alata'],
        Lobster: ['Lobster']
      },
      letterSpacing: {
        widest: '.3em',
      },
    },
  },
  plugins: [],
}