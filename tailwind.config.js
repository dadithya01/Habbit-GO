/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.js", "./screens/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Paper background — not the generic AI cream, a cooler off-white
        paper: "#FAFAF8",
        surface: "#FFFFFF",
        line: "#E5E7E0",
        // Ink — deep green-black, not pure black
        ink: "#14231F",
        muted: "#7C8B85",
        // Primary — deep forest teal, stands for "growth / consistency"
        primary: {
          DEFAULT: "#1B4B43",
          light: "#2E6B60",
          soft: "#E4EFEC",
        },
        // Ember — the streak/flame accent, used sparingly and only for streaks
        ember: {
          DEFAULT: "#E8630A",
          soft: "#FCE7D8",
        },
        // Success — used only for a completed check-off state
        success: {
          DEFAULT: "#2F9E44",
          soft: "#E4F5E7",
        },
        danger: "#C1443B",
      },
      fontFamily: {
        display: ["SpaceGrotesk_600SemiBold"],
        "display-bold": ["SpaceGrotesk_700Bold"],
        body: ["Inter_400Regular"],
        "body-medium": ["Inter_500Medium"],
        "body-semibold": ["Inter_600SemiBold"],
      },
    },
  },
  plugins: [],
};
