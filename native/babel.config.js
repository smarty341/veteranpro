module.exports = function (api) {
  api.cache(true);
  return {
    // unstable_transformImportMeta: lets the web (Hermes-profile) bundle run
    // `import.meta` when loaded as a classic script. No-op for native builds.
    presets: [["babel-preset-expo", { unstable_transformImportMeta: true }]],
  };
};
