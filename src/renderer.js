const fs = require("fs-extra");
const formatDate = require('date-fns/format');
const minifier = require("html-minifier");
const nunjucks = require("nunjucks");

class Renderer {
  /**
   * Create new Renderer.
   * @param  {Config} config - The Config instance.
   * @return {Proxy}
   */
  constructor(config) {
    this.config = config;
    this.env = nunjucks.configure(config.templatesPath);

    this.env.addGlobal("config", this.config);
    this.env.addFilter("absoluteUrl", path => this.config.getUrl(path));
    this.env.addFilter("relativeUrl", path => this.config.getRelativeUrl(path));
    this.env.addFilter(
      "formatDate",
      (date, format = config.defaultDateFormat) => formatDate(date, format)
    );

    return new Proxy(this, {
      get(renderer, prop) {
        return prop in renderer ? renderer[prop] : renderer.env[prop];
      }
    });
  }

  /**
   * Render the given template.
   * @param  {String} template - The template path to render.
   * @param  {Object} data     - The view data to render.
   * @return {String}
   */
  render(template, data = {}) {
    let str = this.env.render(template, data);

    if (this.config.isProduction()) {
      str = minifier.minify(str, {
        collapseWhitespace: true,
        removeComments: true
      });
    }

    if (this.config.watch) {
      str = str.replace(
        /(<\/body[\s]*>)/i,
        `
        <script src="/socket.io/socket.io.js"></script>
        <script src="/flores/socket-client.js"></script>
        $1
      `
      );
    }

    return str;
  }

  /**
   * Render the template and write it to a file.
   * @param  {String} outputPath  - The path to save the file.
   * @param  {String} template    - The template to render.
   * @param  {Object} data        - The view data to render.
   * @return {String}
   */
  async writeHtml(outputPath, template, data = {}) {
    const str = this.render(template, data);

    await fs.outputFile(outputPath, str);

    return str;
  }

  /**
   * Clear the compiled template cache.
   * @return {Void}
   */
  clearCache() {
    for (let i = 0; i < this.env.loaders.length; i += 1) {
      this.env.loaders[i].cache = {};
    }
  }
}

module.exports = Renderer;
