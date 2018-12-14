const path = require("path");

const INDEX_FILENAME = /index.html$/i;

/**
 * Get the output info.
 * @param  {String} options.sourcePath - The source absolute path.
 * @param  {Config} options.config - The Config instance.
 * @return {Object}
 */
const getOutputInfo = (sourcePath, config) => {
  // Output path.
  const sourcePathRelative = path.relative(config.sourceDir, sourcePath);
  const { base, ...sourcePathRelativeObj } = path.parse(sourcePathRelative);
  const outputPathRelative = path.format({ ...sourcePathRelativeObj, ext: ".html" });
  const outputPath = path.join(config.outputDir, outputPathRelative);

  // Collection dir.
  const { dir } = path.parse(outputPathRelative);
  const collectionName = dir ? dir : "root";

  // Urls.
  const urlPath = INDEX_FILENAME.test(outputPathRelative)
    ? outputPathRelative.replace(INDEX_FILENAME, "")
    : outputPathRelative;

  const url = config.url(urlPath);
  const relativeUrl = config.relativeUrl(urlPath);

  return {
    outputPath,
    collectionName,
    url,
    relativeUrl
  };
};

module.exports = getOutputInfo;
