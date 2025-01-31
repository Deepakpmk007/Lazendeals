/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "custom-gradient": "linear-gradient(to bottom, #F3E5D9, #F8D3D3)",
      },
      fontFamily: {
        logo: "Cinzel Decorative, serif",
      },
    },
  },
  plugins: [],
};
