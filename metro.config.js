const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Firebase JS SDK's package.json "exports" field isn't resolved correctly by
// Metro's newer package-exports resolution, which causes runtime errors like
// "Component auth has not been registered yet". Falling back to the classic
// main/browser field resolution fixes it.
config.resolver.unstable_enablePackageExports = false;
config.resolver.sourceExts.push("cjs");

module.exports = withNativeWind(config, { input: "./global.css" });
