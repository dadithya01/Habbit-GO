/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.tsx",
    "./screens/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // ---- Material 3 tonal color roles, seeded from a bold teal ----
        primary: {
          DEFAULT: "#0C6B5D",
          container: "#9EF2DE",
        },
        onPrimary: "#FFFFFF",
        onPrimaryContainer: "#00201A",

        secondary: {
          DEFAULT: "#4A635C",
          container: "#CCE8DF",
        },
        onSecondary: "#FFFFFF",
        onSecondaryContainer: "#05201A",

        // Tertiary carries the "streak / flame" accent — used sparingly
        tertiary: {
          DEFAULT: "#8A5300",
          container: "#FFDDB1",
        },
        onTertiary: "#FFFFFF",
        onTertiaryContainer: "#2B1700",

        error: {
          DEFAULT: "#BA1A1A",
          container: "#FFDAD6",
        },
        onError: "#FFFFFF",
        onErrorContainer: "#410002",

        surface: {
          DEFAULT: "#F7FAF8",
          dim: "#D7DBD8",
          bright: "#F7FAF8",
          lowest: "#FFFFFF",
          low: "#F1F4F1",
          container: "#EBEEEB",
          high: "#E5E9E5",
          highest: "#DFE4DF",
        },
        onSurface: "#191C1A",
        onSurfaceVariant: "#3F4944",

        outline: "#6F7975",
        outlineVariant: "#BFC9C3",
      },
      fontFamily: {
        display: ["SpaceGrotesk_600SemiBold"],
        "display-bold": ["SpaceGrotesk_700Bold"],
        body: ["Inter_400Regular"],
        "body-medium": ["Inter_500Medium"],
        "body-semibold": ["Inter_600SemiBold"],
      },
      fontSize: {
        // ---- Material 3 type scale (subset actually used in-app) ----
        "display-sm": ["36px", { lineHeight: "44px" }],
        "headline-lg": ["30px", { lineHeight: "38px" }],
        "headline-md": ["26px", { lineHeight: "34px" }],
        "title-lg": ["20px", { lineHeight: "26px" }],
        "title-md": ["16px", { lineHeight: "22px" }],
        "body-lg": ["15px", { lineHeight: "23px" }],
        "body-md": ["14px", { lineHeight: "20px" }],
        "body-sm": ["12.5px", { lineHeight: "18px" }],
        "label-lg": ["13.5px", { lineHeight: "18px" }],
        "label-md": ["12px", { lineHeight: "16px" }],
        "label-sm": ["11px", { lineHeight: "14px" }],
      },
      borderRadius: {
        "m3-xs": "4px",
        "m3-sm": "8px",
        "m3-md": "12px",
        "m3-lg": "16px",
        "m3-xl": "28px",
      },
    },
  },
  plugins: [],
};
