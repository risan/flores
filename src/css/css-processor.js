const path = require("path");

const globby = require("globby");

const readFile = require("../fs/read-file");
const setupPostcss = require("./setup-postcss");

class CssProcessor {
  constructor({
    source = process.cwd(),
    destination,
    importPaths = [],
    presetEnvOptions = {},
    minify = false,
    hash = false
  }) {
    this.source = source;
    this.destination = destination;
    this.hash = hash;

    this.postcss = setupPostcss({
      importPaths,
      presetEnvOptions,
      minify
    });
  }

  async processAll() {
    const files = await this.getAllCssFiles();

    Promise.all(files.map(file => this.process(file)));

    // console.log(files);
  }

  async process(file) {
    console.log(file);
    const sourcePath = path.resolve(this.source, file);

    const source = await readFile(sourcePath);

    const compiled = await this.compile(source, {
      from: sourcePath
    });

    return compiled;
  }

  /**
   * Get all css files.
   * @return {Array}
   */
  async getAllCssFiles() {
    return globby("**/[^_]*.css", {
      cwd: this.source
    });
  }

  async compile(source, options = { from: undefined }) {
    const result = await this.postcss.process(source, options);

    return result.css;
  }
}

module.exports = CssProcessor;
