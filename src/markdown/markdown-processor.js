const p = require("path");

const globby = require("globby");
const groupBy = require("lodash.groupby");
const orderBy = require("lodash.orderby");

const generateOutputPath = require("../util/generate-output-path");
const MarkdownParser = require("./markdown-parser");
const writeFile = require("../fs/write-file");

const INDEX_FILENAME = /index.html$/i;
const TRAILING_SLASH = /\/$/;

class MarkdownProcessor {
  /**
   * Create MarkdownProcessor instance.
   * @param  {String} options.source          - The markdown source directory.
   * @param  {String} options.output          - The output directory.
   * @param  {String} options.baseUrl         - The base URL to prepend to the post's url.
   * @param  {String} options.defaultTemplate - The default template to use.
   * @param  {Renderer} options.renderer      - The Renderer instance.
   * @param  {Object} options.parserOptions   - The markdown parser options.
   */
  constructor({
    source = process.cwd(),
    output,
    baseUrl = "",
    defaultTemplate = "post.njk",
    renderer,
    parserOptions = {}
  }) {
    this.source = source;
    this.output = output;
    this.baseUrl = baseUrl.replace(TRAILING_SLASH, "");
    this.defaultTemplate = defaultTemplate;
    this.renderer = renderer;
    this.parser = new MarkdownParser(parserOptions);
  }

  /**
   * Process all markdown files.
   * @return {Object}
   */
  async processAll() {
    const { pages, posts, collections } = await this.collectData();

    this.renderer.addGlobal("pages", pages);
    this.renderer.addGlobal("posts", posts);
    this.renderer.addGlobal("collections", collections);

    await Promise.all(posts.map(post => this.writeHtml(post)));

    await Promise.all(pages.map(page => this.writeHtml(page)));

    return { pages, posts, collections };
  }

  /**
   * Collect parsed markdown data.
   * @return {Object}
   */
  async collectData() {
    const items = await this.parseAllFiles();

    const pages = items.filter(item => item.frontMatter.page);

    const posts = orderBy(
      items.filter(item => !item.frontMatter.page),
      "frontMatter.date",
      "desc"
    );

    const collections = groupBy(posts, "collectionName");

    return { pages, posts, collections };
  }

  /**
   * Write the markdown data to HTML file.
   * @param  {Object} data - The parsed markdown data.
   * @return {Promise}
   */
  async writeHtml(data) {
    const template = data.frontMatter.template
      ? data.frontMatter.template
      : this.defaultTemplate;

    const html = this.renderer.render(template, {
      ...data,
      collection: this.renderer.getGlobal("collections")[data.collectionName]
    });

    return writeFile(data.outputPath, html);
  }

  /**
   * Parse all markdown files.
   * @return {Array}
   */
  async parseAllFiles() {
    const files = await this.getFiles();

    return Promise.all(files.map(file => this.parseFile(file)));
  }

  /**
   * Parse the given markdown file.
   * @param  {String} path - The markdown file to parse.
   * @return {Object}
   */
  async parseFile(path) {
    const sourcePath = p.resolve(this.source, path);

    const { frontMatter, html } = await this.parser.parseFile(sourcePath);

    const outputPath = generateOutputPath(sourcePath, {
      sourceRoot: this.source,
      outputRoot: this.output,
      ext: ".html"
    });

    const outputPathRel = p.relative(this.output, outputPath);
    const { dir } = p.parse(outputPathRel);

    return {
      frontMatter,
      content: html,
      outputPath,
      url: this.getUrlForOutputPath(outputPath),
      collectionName: dir || "root"
    };
  }

  /**
   * Get url for the given output path.
   * @param  {String} path - The output path.
   * @return {String}
   */
  getUrlForOutputPath(path) {
    const pathRel = p.isAbsolute(path) ? p.relative(this.output, path) : path;

    const urlPath = INDEX_FILENAME.test(pathRel)
      ? pathRel.replace(INDEX_FILENAME, "")
      : pathRel;

    return `${this.baseUrl}/${urlPath}`;
  }

  /**
   * Get all markdown files.
   * @return {Array}
   */
  async getFiles() {
    return globby("**/*.(md|markdown)", {
      cwd: this.source
    });
  }
}

module.exports = MarkdownProcessor;
