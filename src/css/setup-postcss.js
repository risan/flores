const atImport = require("postcss-import");
const cssnano = require("cssnano");
const postcss = require("postcss");
const presetEnv = require("postcss-preset-env");

/**
 * Setup postcss processor.
 * @param  {Array}   options.importPaths      - Array of paths to look for when importing files.
 * @param  {Object}  options.presetEnvOptions - preset-env plugin options.
 * @param  {Boolean} options.minify           - Set to true to use the minifier.
 * @return {postcss}
 */
const setupPostcss = ({
  importPaths = [],
  presetEnvOptions = {},
  minify = false
} = {}) => {
  const processor = postcss([
    atImport({ path: importPaths }),
    presetEnv(presetEnvOptions)
  ]);

  if (minify) {
    processor.use(cssnano);
  }

  return processor;
};

module.exports = setupPostcss;
