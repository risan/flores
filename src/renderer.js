const nunjucks = require("nunjucks");

const minifyHtml = require("./util/minify-html");

const BODY_CLOSING_TAG = /(<\/body[\s]*>)/;

class Renderer {
  /**
   * Create new Renderer instance.
   * @param  {String}  options.templatesPath - Templates path.
   * @param  {Boolean} options.minify        - Set to true to minify the result.
   * @param  {Array}   options.appendScripts - JavaScript URLs to append.
   */
  constructor({
    templatesPath = process.cwd(),
    minify = false,
    appendScripts = []
  } = {}) {
    this.env = nunjucks.configure(templatesPath);

    this.minify = minify;

    this.appendScriptsStr = appendScripts
      .map(script => `<script src="${script}"></script>`.trim())
      .join("");
  }

  /**
   * Add global template data.
   * @param {String} name  - Name of the variable.
   * @param {Mixed}  value - The data value.
   */
  addGlobal(name, value) {
    this.env.addGlobal(name, value);
  }

  /**
   * Get the global template data.
   * @param {String} name  - Name of the global template variable to retrieve.
   * @return {Mixed}
   */
  getGlobal(name) {
    return this.env.getGlobal(name);
  }

  /**
   * Add custom filter.
   * @param {String}   name - The filter name.
   * @param {Function} fn   - The filter function to add.
   */
  addFilter(name, fn) {
    this.env.addFilter(name, fn);
  }

  /**
   * Render the given template name.
   * @param  {String} template - Template name to render.
   * @param  {Object} data     - Data to render.
   * @return {String}
   */
  render(template, data = {}) {
    let str = this.env.render(template, data);

    if (this.minify) {
      str = minifyHtml(str);
    }

    if (this.appendScriptsStr) {
      str = str.replace(BODY_CLOSING_TAG, `${this.appendScriptsStr}$1`);
    }

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
