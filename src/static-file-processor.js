const p = require("path");

const copy = require("./fs/copy");
const generateOutputPath = require("./util/generate-output-path");
const globCopy = require("./fs/glob-copy");

const DEFAULT_PATTERNS = ["**/*.(gif|html|jpg|jpeg|png)"];

class StaticFileProcessor {
  /**
   * Create new StaticFileProcessor instance.
   * @param  {String|Array} options.patterns  - The static files patterns to search.
   * @param  {String} options.source          - The source directory to search.
   * @param  {String} options.output          - The output directory.
   */
  constructor({
    patterns = DEFAULT_PATTERNS,
    source = process.cwd(),
    output
  }) {
    this.patterns = patterns;
    this.source = source;
    this.output = output;
  }

  /**
   * Copy all static files to output directory.
   * @return {Array}
   */
  async copyAll() {
    return globCopy(this.patterns, this.output, {
      cwd: this.source
    });
  }

  /**
   * Copy the given file.
   * @param  {String} path - The file path to copy.
   * @return {Promise}
   */
  async copy(path) {
    const source = p.resolve(this.source, path);
    const destination = generateOutputPath(path, {
      sourceRoot: this.source,
      outputRoot: this.output
    });

    return copy(source, destination);
  }
}

module.exports = StaticFileProcessor;
