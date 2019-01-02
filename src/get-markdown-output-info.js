const path = require("path");

const INDEX_FILENAME = /index.html$/i;

/**
 * Get the output info.
 * @param  {String} markdownPath - The markdown source path.
 * @param  {Config} config - The Config instance.
 * @return {Object}
 */
const getMarkdownOutputInfo = (markdownPath, config) => {
  // Output path.
  const sourcePathRelative = path.relative(config.sourcePath, markdownPath);
  const { base, ...sourcePathRelativeObj } = path.parse(sourcePathRelative);
  const outputPathRelative = path.format({
    ...sourcePathRelativeObj,
    ext: ".html"
  });
  const outputPath = path.join(config.outputPath, outputPathRelative);

  // Collection name.
  const { dir } = path.parse(outputPathRelative);
  const collectionName = dir || "root";

  // Urls.
  const urlPath = INDEX_FILENAME.test(outputPathRelative)
    ? outputPathRelative.replace(INDEX_FILENAME, "")
    : outputPathRelative;

  const url = config.getUrl(urlPath);
  const relativeUrl = config.getRelativeUrl(urlPath);

  return {
    outputPath,
    collectionName,
    url,
    relativeUrl
  };
};

module.exports = getMarkdownOutputInfo;
