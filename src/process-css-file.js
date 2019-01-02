const crypto = require("crypto");
const path = require("path");

const atImport = require("postcss-import");
const cssnano = require("cssnano");
const fs = require("fs-extra");
const postcss = require("postcss");
const presetEnv = require("postcss-preset-env");

/**
 * Process the given CSS file.
 * @param  {String} file   - The path to the CSS file to process.
 * @param  {Config} config - The Config instance.
 * @return {String}
 */
const processCssFile = async (file, config) => {
  const css = await fs.readFile(file, "utf8");

  const relativePath = path.relative(config.sourcePath, file);
  let outputPath = path.join(config.outputPath, relativePath);

  const processor = postcss([
    atImport({ path: [config.assetsPath] }),
    presetEnv(config.postcssPresetEnv)
  ]);

  if (config.isProduction()) {
    processor.use(cssnano);
  }

  const result = await processor.process(css, {
    from: path.relative(config.basePath, file),
    to: path.relative(config.basePath, outputPath),
    map: !config.isProduction()
  });

  if (config.isProduction()) {
    const hash = crypto.createHash("md5");

    hash.update(result.css);

    const outputHash = hash.digest("hex").substring(0, 10);

    outputPath = outputPath.replace(/.css$/i, `.${outputHash}.css`);
  }

  await fs.outputFile(outputPath, result.css);

  return outputPath;
};

module.exports = processCssFile;
