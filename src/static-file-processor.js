const path = require("path");

const copy = require("./fs/copy");
const globCopy = require("./fs/glob-copy");

const DEFAULT_PATTERNS = ["**/*.(gif|html|jpg|jpeg|png)"];

class StaticFileProcessor {
  /**
   * Create new StaticFileProcessor instance.
   * @param  {String|Array} options.patterns  - The static files patterns to search.
   * @param  {String} options.source      - The directory to search.
   * @param  {String} options.destination - The destination path.
   */
  constructor({
    patterns = DEFAULT_PATTERNS,
    source = process.cwd(),
    destination
  }) {
    this.patterns = patterns;
    this.source = source;
    this.destination = destination;
  }

  /**
   * Copy all static files to destionation.
   * @return {Array}
   */
  async copyAll() {
    return globCopy(this.patterns, this.destination, {
      cwd: this.source
    });
  }

  /**
   * Copy the given source file.
   * @param  {String} sourcePath - The source path to copy.
   * @return {Promise}
   */
  async copy(sourcePath) {
    return copy(
      path.resolve(this.source, sourcePath),
      this.getDestinationPathForSource(sourcePath)
    );
  }

  /**
   * Get destination path for the given source.
   * @param  {String} sourcePath - The source path to.
   * @return {String}
   */
  getDestinationPathForSource(sourcePath = "/") {
    const relativePath = path.isAbsolute(sourcePath)
      ? path.relative(this.source, sourcePath)
      : sourcePath;

    return path.resolve(this.destination, relativePath);
  }
}

module.exports = StaticFileProcessor;
