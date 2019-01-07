const p = require("path");

const STARTS_WITH_DOT = /^\./;

/**
 * Generate the output path for the given file.
 * @param  {String} path                - The file path.
 * @param  {String} options.sourceRoot  - The source root directory.
 * @param  {String} options.outputRoot  - The output root directory.
 * @param  {String} options.ext         - Set to override the file extension.
 * @param  {String} options.hash        - The hash to prepend to the filename.
 * @return {String}
 */
const generateOutputPath = (
  path,
  { sourceRoot = process.cwd(), outputRoot, ext = undefined, hash = undefined }
) => {
  const relativePath = p.isAbsolute(path) ? p.relative(sourceRoot, path) : path;

  const outputPath = p.resolve(outputRoot, relativePath);

  // Need to remove "base" property, so it won't override both "ext" and
  // "name" properties when using path.format().
  const { base, ...outputPathObj } = p.parse(outputPath);

  if (ext) {
    const extWithDot = STARTS_WITH_DOT.test(ext) ? ext : `.${ext}`;

    outputPathObj.ext = extWithDot;
  }

  if (hash) {
    outputPathObj.name = `${outputPathObj.name}.${hash}`;
  }

  return p.format(outputPathObj);
};

module.exports = generateOutputPath;
