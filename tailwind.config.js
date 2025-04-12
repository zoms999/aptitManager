/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    fontSize: {
      xs: ['0.75rem', { lineHeight: '1rem' }],       // 12px -> 11.25px
      sm: ['0.8125rem', { lineHeight: '1.25rem' }],  // 13px -> 12px
      base: ['0.9375rem', { lineHeight: '1.5rem' }], // 15px -> 14px
      lg: ['1.0625rem', { lineHeight: '1.75rem' }],  // 17px -> 16px
      xl: ['1.1875rem', { lineHeight: '1.75rem' }],  // 19px -> 18px
      '2xl': ['1.375rem', { lineHeight: '2rem' }],   // 22px -> 21px
      '3xl': ['1.6875rem', { lineHeight: '2.25rem' }], // 27px -> 25px
      '4xl': ['2.0625rem', { lineHeight: '2.5rem' }],  // 33px -> 31px
      '5xl': ['2.625rem', { lineHeight: '1' }],      // 42px -> 39px
      '6xl': ['3.25rem', { lineHeight: '1' }],       // 52px -> 49px
      '7xl': ['3.75rem', { lineHeight: '1' }],       // 60px -> 56px
      '8xl': ['4.5rem', { lineHeight: '1' }],        // 72px -> 67px
      '9xl': ['6rem', { lineHeight: '1' }],          // 96px -> 90px
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [],
} 