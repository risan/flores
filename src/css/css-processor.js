const p = require("path");

const globby = require("globby");
const zipObject = require("lodash.zipobject");

const readFile = require("../fs/read-file");
const setupPostcss = require("./setup-postcss");
const writeToOutput = require("../fs/write-to-output");

const TRAILING_SLASH = /\/$/;

class CssProcessor {
  /**
   * Create new CssProcessor instance.
   * @param  {String}  options.source           - The source directory.
   * @param  {String}  options.output           - The output directory.
   * @param  {String}  options.baseUrl          - The base url to prepend to the output url.
   * @param  {Array}   options.importPaths      - Array of paths to look for when importing files.
   * @param  {Object}  options.presetEnvOptions - postcss-preset-env plugin options.
   * @param  {Boolean} minify                   - Set to true to minify the css.
   * @param  {Boolean} sourceMap                - Set to true to inline the source map.
   * @param  {Boolean} hash                     - Set to true to append file hash.
   */
  constructor({
    source = process.cwd(),
    output,
    baseUrl = "",
    importPaths = [],
    presetEnvOptions = {},
    minify = false,
    sourceMap = true,
    hash = false
  }) {
    this.source = source;
    this.output = output;
    this.baseUrl = baseUrl.replace(TRAILING_SLASH, "");
    this.sourceMap = sourceMap;
    this.hash = hash;

    this.postcss = setupPostcss({
      importPaths,
      presetEnvOptions,
      minify
    });
  }

  /**
   * Process all css files.
   * @return {Object}
   */
  async processAll() {
    const files = await this.getFiles();

    const results = await Promise.all(files.map(file => this.process(file)));

    const sourcePaths = results.map(result => result.source);
    const outputUrls = results.map(result => result.url);

    return zipObject(sourcePaths, outputUrls);
  }

  /**
   * Process the given css file.
   * @param  {String} path - The CSS file path.
   * @return {Object}
   */
  async process(path) {
    const sourcePath = p.resolve(this.source, path);

    const source = await readFile(sourcePath);

    const compiled = await this.compile(source, {
      from: sourcePath,
      map: this.sourceMap
    });

    const outputPath = await writeToOutput(compiled, {
      source: sourcePath,
      sourceRoot: this.source,
      outputRoot: this.output,
      hash: this.hash
    });

    const output = p.relative(this.output, outputPath);

    return {
      source: p.relative(this.source, sourcePath),
      output,
      url: `${this.baseUrl}/${output}`
    };
  }

  /**
   * Get all css files.
   * @return {Array}
   */
  async getFiles() {
    return globby("**/[^_]*.css", {
      cwd: this.source
    });
  }

  /**
   * Compile the given css source.
   * @param  {String} source  - The CSS source to compile.
   * @param  {Object} options - Postcss processOptions.
   * @return {String}
   */
  async compile(source, options = { from: undefined }) {
    const { css } = await this.postcss.process(source, options);

    return css;
  }
}

module.exports = CssProcessor;
