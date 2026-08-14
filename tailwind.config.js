/** @type {import('tailwindcss').Config} */
module.exports = {
  // Scans every .ejs view for class names actually used, so the production build
  // only ships the CSS your pages need instead of the whole framework (which is
  // what the Play CDN - <script src="https://cdn.tailwindcss.com"> - does).
  content: ["./views/**/*.ejs"],
  theme: {
    extend: {},
  },
  plugins: [],
};
