/* eslint no-console: "off" */
const formatDate = require("date-fns/format");

const CssProcessor = require("./css/css-processor");
const Config = require("./config");
const MarkdownProcessor = require("./markdown/markdown-processor");
const remove = require("./fs/remove");
const Renderer = require("./renderer");
const SitemapGenerator = require("./sitemap-generator");
const StaticFileProcessor = require("./static-file-processor");

class Processor {
  /**
   * Create new instance of Processor.
   * @param  {Object} options - The configuration options.
   */
  constructor(options = {}) {
    this.config = new Config(options);

    this.renderer = new Renderer({
      templatesPath: this.config.templatesPath,
      minify: this.config.isProduction(),
      appendScripts: this.config.watch
        ? ["/socket.io/socket.io.js", "/flores/socket-client.js"]
        : []
    });

    this.renderer.addGlobal("config", this.config);

    this.renderer.addFilter("absoluteUrl", path =>
      this.config.urlGenerator.to(path)
    );

    this.renderer.addFilter("relativeUrl", path =>
      this.config.urlGenerator.relative(path)
    );

    this.renderer.addFilter(
      "formatDate",
      (date, format = this.config.defaultDateFormat) => formatDate(date, format)
    );

    this.css = new CssProcessor({
      source: this.config.source,
      output: this.config.output,
      urlGenerator: this.config.urlGenerator,
      presetEnvOptions: this.config.postcssPresetEnv,
      minify: this.config.isProduction(),
      sourceMap: !this.config.isProduction(),
      hash: this.config.isProduction()
    });

    this.markdown = new MarkdownProcessor({
      source: this.config.source,
      output: this.config.output,
      urlGenerator: this.config.urlGenerator,
      defaultTemplate: this.config.defaultTemplate,
      renderer: this.renderer,
      parserOptions: {
        ...this.config.markdown,
        anchor: this.config.markdownAnchor,
        toc: this.config.markdownToc
      }
    });

    this.sitemap = new SitemapGenerator({ output: this.config.output });

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

    await this.processMarkdown();

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

    this.renderer.addGlobal("css", assets);

    this.log(`✅ ${Object.keys(assets).length} CSS files are compiled.`);

    return assets;
  }

  /**
   * Process markdown files.
   * @return {Object}
   */
  async processMarkdown() {
    const data = await this.markdown.processAll();

    this.log(`✅ ${data.posts.length} posts are processed.`);
    this.log(`✅ ${data.pages.length} pages are processed.`);

    await this.sitemap.generate({ posts: data.posts, pages: data.pages });

    this.log("✅ Sitemap is generated.");

    return data;
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
