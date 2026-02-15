const config = require('@npm.piece/tailwind-config/tailwind.config')

module.exports = {
  plugins: {
    'postcss-import': {},
    'tailwindcss/nesting': 'postcss-nesting',
    tailwindcss: { config },
    autoprefixer: {},
  },
}
