module.exports = {
  content: [
   "./public/**/*.html",
    "./public/js/**/*.js",
    "./*.html",
    "./js/**/*.js",
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