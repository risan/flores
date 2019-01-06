const path = require("path");

const STARTS_WITH_DOT = /^\./;

/**
 * Get destination path for the given source path.
 * @param  {String} sourcePath          - The source path.
 * @param  {String} options.source      - The source root directory.
 * @param  {String} options.destination - The destination root directory.
 * @param  {String} options.ext         - The new file extension.
 * @param  {String} options.hash        - The file has to prepend.
 * @return {String}
 */
const getDestinationPathForSource = (
  sourcePath,
  { source = process.cwd(), destination, ext = undefined, hash = undefined }
) => {
  const relativePath = path.isAbsolute(sourcePath)
    ? path.relative(source, sourcePath)
    : sourcePath;

  const destPath = path.resolve(destination, relativePath);

  // Need to remove "base" property, so it won't override both "ext" and
  // "name" properties when using path.format().
  const { base, ...destPathObj } = path.parse(destPath);

  if (ext) {
    const extWithDot = STARTS_WITH_DOT.test(ext) ? ext : `.${ext}`;

    destPathObj.ext = extWithDot;
  }

  if (hash) {
    destPathObj.name = `${destPathObj.name}.${hash}`;
  }

  return path.format(destPathObj);
};

module.exports = getDestinationPathForSource;
