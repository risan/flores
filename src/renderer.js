const fs = require("fs-extra");
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
    this.env = nunjucks.configure(config.templatesDir);

    this.env.addGlobal("config", this.config);
    this.env.addFilter("absoluteUrl", path => this.config.getUrl(path));
    this.env.addFilter("relativeUrl", path => this.config.getRelativeUrl(path));

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
    return this.env.render(template, data);
  }

  /**
   * Render the template and write to file.
   * @param  {String} outputPath  - The path to save the file.
   * @param  {String} template    - The template to render.
   * @param  {Object} data        - The view data to render.
   * @return {String}
   */
  async writeHtml(outputPath, template, data = {}) {
    let str = this.render(template, data);

    if (this.config.isProduction()) {
      str = minifier.minify(str, {
        collapseWhitespace: true,
        removeComments: true
      });
    }

    if (this.config.watch) {
      str = str.replace(/(<\/body[\s]*>)/i, `
        <script src="/socket.io/socket.io.js"></script>
        <script src="/flores/socket-client.js"></script>
        $1
      `);
    }

    await fs.outputFile(outputPath, str);

    return str;
  }

  /**
   * Clear the compiled template cache.
   * @return {Void}
   */
  clearCache() {
    this.env.loaders.forEach(loader => loader.cache = {});
  }
}

module.exports = Renderer;
