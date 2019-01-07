/* eslint no-console: "off" */
const CssProcessor = require("./css/css-processor");
const Config = require("./config");
const remove = require("./fs/remove");
const StaticFileProcessor = require("./static-file-processor");

class Processor {
  /**
   * Create new instance of Processor.
   * @param  {Object} options - The configuration options.
   */
  constructor(options = {}) {
    this.config = new Config(options);

    this.css = new CssProcessor({
      source: this.config.source,
      output: this.config.output,
      baseUrl: this.config.pathname,
      presetEnvOptions: this.config.postcssPresetEnv,
      minify: this.config.isProduction(),
      sourceMap: !this.config.isProduction(),
      hash: this.config.isProduction()
    });

    this.staticFile = new StaticFileProcessor({
      patterns: this.config.copyFiles,
      source: this.config.source,
      output: this.config.output
    });
  }

  /**
   * Generate the website.
   * @return {Promise}
   */
  async process() {
    this.log("⏳ Generating website...");

    await this.cleanOutputDir();

    await this.processCss();

    await this.copyStaticFiles();
  }

  /**
   * Clean the output directory.
   * @return {Promoise}
   */
  async cleanOutputDir() {
    await remove(this.config.output);

    this.log("✅ Output directory is cleaned.");
  }

  /**
   * Process css files.
   * @return {Object}
   */
  async processCss() {
    const assets = await this.css.processAll();

    this.log(`✅ ${Object.keys(assets).length} CSS files are compiled.`);

    return assets;
  }

  /**
   * Copy all static files.
   * @return {Array}
   */
  async copyStaticFiles() {
    const files = await this.staticFile.copyAll();

    this.log(`✅ ${files.length} static files are copied.`);

    return files;
  }

  /**
   * Log the message to the console.
   * @param  {String} message - The message to log.
   * @return {Void}
   */
  log(message) {
    if (this.config.verbose) {
      console.log(message);
    }
  }
}

module.exports = Processor;
