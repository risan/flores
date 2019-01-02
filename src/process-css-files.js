const path = require("path");

const globby = require("globby");
const zipObject = require("lodash.zipobject");

const processCssFile = require("./process-css-file");

/**
 * Process all CSS files.
 * @param  {Config} config - The Config instance.
 * @return {Object}
 */
const processCssFiles = async config => {
  const sourceFiles = await globby("**/[^_]*.css", {
    cwd: config.assetsPath,
    absolute: true
  });

  const outputFiles = await Promise.all(
    sourceFiles.map(file => processCssFile(file, config))
  );

  const sourceNames = sourceFiles.map(file =>
    path.relative(config.assetsPath, file)
  );

  const outputRelativeUrls = outputFiles.map(file =>
    config.getRelativeUrl(path.relative(config.outputPath, file))
  );

  return zipObject(sourceNames, outputRelativeUrls);
};

module.exports = processCssFiles;
