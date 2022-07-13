const tailwindcss = require('tailwindcss');
module.exports = {
  plugins: {
    tailwindcss: {
      content: [
        "./src/**/*.{js,jsx,ts,tsx}",
      ],
      theme: {
        extend: {},
      },
      plugins: [
        tailwindcss("./tailwind.config.js"),
        require('autoprefixer')
      ],
    },
    autoprefixer: {},
  },
}