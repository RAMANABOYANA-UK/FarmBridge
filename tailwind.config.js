module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9f0',
          100: '#dcf2dc',
          200: '#bce4bc',
          300: '#90d190',
          400: '#5db65d',
          500: '#3a9a3a', // Main green
          600: '#2d7d2d',
          700: '#266326',
          800: '#224f22',
          900: '#1e421e',
        },
        secondary: {
          50: '#fffef0',
          100: '#fff9dc',
          200: '#fff1bc',
          300: '#ffe690',
          400: '#ffd75d',
          500: '#ffc53a', // Accent orange
          600: '#d9a22d',
          700: '#b38126',
          800: '#8f6422',
          900: '#76501e',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        'devanagari': ['Noto Sans Devanagari', 'sans-serif'],
        'tamil': ['Noto Sans Tamil', 'sans-serif'],
        'telugu': ['Noto Sans Telugu', 'sans-serif'],
        'bengali': ['Noto Sans Bengali', 'sans-serif'],
        'gujarati': ['Noto Sans Gujarati', 'sans-serif'],
        'kannada': ['Noto Sans Kannada', 'sans-serif'],
        'malayalam': ['Noto Sans Malayalam', 'sans-serif']
      }
    },
  },
  plugins: [],
}