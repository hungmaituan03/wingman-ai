// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Allow CommonJS entrypoints (Firebase ships some .cjs files)
config.resolver.sourceExts.push('cjs');

// Disable the new package-exports resolution
config.resolver.unstable_enablePackageExports = false;

module.exports = config;
