// Design tokens for Maelstrom UI
// This file can be used to generate Figma tokens or other design system assets

export const designTokens = {
  colors: {
    // Background layers
    bg: {
      900: "#04132b", // Deep ocean blue
      800: "#071a36", // Slightly lighter ocean
      700: "#0a2142", // Mid-tone blue
    },
    // Primary brand colors
    primary: {
      600: "#0b3a66", // Deep blue
      500: "#1e5a8a", // Medium blue
      400: "#3b82f6", // Bright blue
    },
    // Accent colors for highlights and CTAs
    accent: {
      cyan: "#00d8ff", // Bright cyan
      cyan2: "#2bd3ff", // Lighter cyan
      teal: "#14b8a6", // Teal accent
    },
    // Neutral colors
    neutral: {
      muted: "#94a3b8", // Muted slate
      border: "#334155", // Border color
      text: "#f1f5f9", // Light text
    },
  },

  // Typography scale
  typography: {
    fontFamily: {
      sans: ["Geist Sans", "system-ui", "sans-serif"],
      mono: ["Geist Mono", "monospace"],
    },
    fontSize: {
      xs: "0.75rem",
      sm: "0.875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem",
      "5xl": "3rem",
    },
    lineHeight: {
      tight: "1.25",
      normal: "1.5",
      relaxed: "1.625",
    },
  },

  // Spacing scale
  spacing: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    "2xl": "3rem",
    "3xl": "4rem",
  },

  // Border radius
  borderRadius: {
    sm: "0.5rem",
    md: "0.75rem",
    lg: "1rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    full: "9999px",
  },

  // Shadows and effects
  effects: {
    shadows: {
      soft: "0 4px 20px rgba(4, 19, 43, 0.1)",
      medium: "0 8px 40px rgba(4, 19, 43, 0.15)",
      glow: "0 0 20px rgba(0, 216, 255, 0.3)",
      glowStrong: "0 0 30px rgba(0, 216, 255, 0.5)",
    },
    blur: {
      sm: "4px",
      md: "8px",
      lg: "16px",
    },
  },

  // Animation durations
  animation: {
    duration: {
      fast: "150ms",
      normal: "300ms",
      slow: "500ms",
    },
    easing: {
      ease: "ease",
      easeIn: "ease-in",
      easeOut: "ease-out",
      easeInOut: "ease-in-out",
    },
  },
} as const

export type DesignTokens = typeof designTokens
