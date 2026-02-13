// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: [
//     // "./app/**/*.{js,ts,jsx,tsx,mdx}",
//     "./pages/**/*.{js,ts,jsx,tsx,mdx}",
//     "./Components/**/*.{js,ts,jsx,tsx,mdx}",
 
//     // Or if using `src` directory:
//     // "./src/**/*.{js,ts,jsx,tsx,mdx}",
//   ],
//   theme: {
//     extend: {
//       fontFamily: {
//         primary: ["Poppins"],
//       },
//     },
//   },
//   plugins: [],
// }



// tailwind.config.ts
import type { Config } from 'tailwindcss'

export default {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './Components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: { primary: ['Poppins'] },
    },
  },
  plugins: [],
  // Ensure CSS is purged properly in production
  future: {
    hoverOnlyWhenSupported: true,
  },
} satisfies Config
