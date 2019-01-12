const p = require("path");
const { URL } = require("url");

const PRODUCTION = "production";

const PROTOCOL = /^http[s]?:\/\//i;
const LEADING_SLASH = /^\//;
const TRAILING_SLASH = /\/$/;

class Config {
  /**
   * Create new config instance.
   * @param {Object} options - The site configuration options.
   */
  constructor(options = {}) {
    this.options = { ...Config.defaultOptions, ...options };

    this.parseOptions(this.options);

    return new Proxy(this, {
      get(config, prop) {
        return prop in config ? config[prop] : config.options[prop];
      }
    });
  }

  /**
   * Parse the config options.
   * @param  {Object} options - The config options.
   * @return {Void}
   */
  parseOptions(options) {
    this.cwd = p.resolve(options.cwd);
    this.source = p.resolve(this.cwd, options.source);
    this.output = p.resolve(this.cwd, options.output);
    this.templatesPath = p.resolve(this.source, options.templatesDir);

    this.url = PROTOCOL.test(options.url)
      ? options.url
      : `http://${options.url}`;

    const urlObj = new URL(this.url);

    this.port = urlObj.port ? parseInt(urlObj.port, 10) : 4000;

    if (this.isProduction()) {
      this.origin = urlObj.origin;
      this.pathname = urlObj.pathname.replace(TRAILING_SLASH, "") + "/";
    } else {
      this.origin = `http://localhost:${this.port}`;
      this.pathname = "/";
    }
  }

  /**
   * Get url for the given path.
   * @param  {String} path - The url path to generate.
   * @return {String}
   */
  getUrl(path = "/") {
    const relativeUrl = this.getRelativeUrl(path);

    return relativeUrl === "/" ? this.origin : this.origin + relativeUrl;
  }

  /**
   * Get relative url for the given path.
   * @param  {String} path - The url path to generate.
   * @return {String}
   */
  getRelativeUrl(path = "/") {
    const cleanPath = path.replace(LEADING_SLASH, "");

    return this.pathname + cleanPath;
  }

  /**
   * Check if it's a production environment.
   * @return {Boolean}
   */
  isProduction() {
    return this.options.env.toLowerCase() === "production";
  }

  /**
   * Get the default config options.
   * @return {Object}
   */
  static get defaultOptions() {
    return {
      env: process.env.NODE_ENV ? process.env.NODE_ENV : PRODUCTION,
      watch: false,
      url: "http://localhost:4000",
      cwd: process.cwd(),
      verbose: true,
      source: "src",
      output: "public",
      templatesDir: "templates",
      defaultDateFormat: "YYYY-MM-DD HH:mm:ss",
      defaultTemplate: "post.njk",
      copyFiles: ["images/**", "robot.txt", "**/*.html"],
      markdown: {},
      markdownAnchor: {
        permalink: true
      },
      markdownToc: {
        containerHeaderHtml: "<h2>Table of Contents</h2>",
        includeLevel: [2, 3, 4]
      },
      postcssPresetEnv: {
        stage: 3,
        preserve: false
      }
    };
  }
}

module.exports = Config;
