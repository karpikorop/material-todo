const { composePlugins, withNx } = require('@nx/webpack');

module.exports = composePlugins(withNx(), (config) => {
  config.target = 'node';

  // FIX: Find the ts-loader rule and ensure transpileOnly is FALSE
  const tsRule = config.module.rules.find(
    (r) =>
      r.loader === 'ts-loader' ||
      (Array.isArray(r.use) && r.use.some((u) => u.loader === 'ts-loader'))
  );

  if (tsRule) {
    const loaderConfig = Array.isArray(tsRule.use)
      ? tsRule.use.find((u) => u.loader === 'ts-loader')
      : tsRule;

    loaderConfig.options = {
      ...loaderConfig.options,
      transpileOnly: false, // <--- CRITICAL: Must be false to emit metadata/decorators
      compilerOptions: {
        emitDecoratorMetadata: true, // Force it here too just to be safe
      },
    };
  }

  return config;
});
