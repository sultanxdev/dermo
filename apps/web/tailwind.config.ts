import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#F5F6F0',
        primary: {
          DEFAULT: '#553E53',
          dark: '#553E53',
          50: '#F7F4F6',
          100: '#EDE7EC',
          200: '#DCCFD9',
          300: '#C2ADC0',
          400: '#8E6F8B',
          500: '#6D506B',
          600: '#553E53',
          700: '#433041',
          800: '#322330',
          900: '#221721',
        },
        brand: {
          50: '#F7F4F6',
          100: '#EDE7EC',
          200: '#DCCFD9',
          300: '#C2ADC0',
          400: '#8E6F8B',
          500: '#6D506B',
          600: '#553E53',
          700: '#433041',
          800: '#322330',
          900: '#221721',
          950: '#150E14',
        },
        secondary: {
          DEFAULT: '#B6CBDE',
          accent: '#B6CBDE',
          50: '#F6F9FB',
          100: '#EBF1F6',
          200: '#D7E4EE',
          300: '#B6CBDE',
          400: '#9ABBD3',
          500: '#7AA0BF',
          600: '#5C82A2',
          700: '#46647E',
          800: '#344B5E',
          900: '#243442',
        },
        accent: {
          DEFAULT: '#B6CBDE',
          50: '#F6F9FB',
          100: '#EBF1F6',
          200: '#D7E4EE',
          300: '#B6CBDE',
          400: '#9ABBD3',
          500: '#7AA0BF',
          600: '#5C82A2',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          muted: '#EAECE4',
          card: '#FFFFFF',
          border: '#DDE2D7',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'slide-in-left': {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.94)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 24px -4px rgba(182, 203, 222, 0.45)' },
          '50%': { boxShadow: '0 0 36px -2px rgba(85, 62, 83, 0.18)' },
        },
        breathe: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.9' },
          '50%': { transform: 'scale(1.03)', opacity: '1' },
        },
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in-up': 'fade-in-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) both',
        float: 'float 5s ease-in-out infinite',
        shimmer: 'shimmer 3s linear infinite',
        'gradient-shift': 'gradient-shift 8s ease infinite',
        'slide-in-right': 'slide-in-right 0.6s cubic-bezier(0.16, 1, 0.3, 1) both',
        'slide-in-left': 'slide-in-left 0.6s cubic-bezier(0.16, 1, 0.3, 1) both',
        'scale-in': 'scale-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) both',
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
        breathe: 'breathe 4s ease-in-out infinite',
      },
      transitionTimingFunction: {
        spring: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
