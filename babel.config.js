module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    // Required by NativeWind v4.2+ on Expo SDK 54 (which ships Reanimated v4)
    // even though this app doesn't use Reanimated directly. Do NOT also add
    // react-native-worklets/plugin — Reanimated v4 bundles it internally and
    // adding both causes a duplicate-plugin error.
    plugins: ["react-native-reanimated/plugin"],
  };
};
