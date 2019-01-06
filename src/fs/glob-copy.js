const path = require("path");

const globby = require("globby");

const copy = require("./copy");

/**
 * Glob copy.
 * @param  {String|Array} patterns  - File patterns to copy.
 * @param  {String} destination     - The destination root directory path.
 * @param  {String} options.cwd     - The directory to search.
 * @return {Array}
 */
const globCopy = async (
  patterns,
  destination,
  { cwd = process.cwd() } = {}
) => {
  const files = await globby(patterns, { cwd });

  await Promise.all(
    files.map(file => copy(path.join(cwd, file), path.join(destination, file)))
  );

  return files;
};

module.exports = globCopy;
