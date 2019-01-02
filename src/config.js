const path = require("path");
const { URL } = require("url");

const PRODUCTION = "production";

const PROTOCOL = /^http[s]?:\/\//i;
const LEADING_SLASH = /^\//;
const LEADING_AND_TRAILING_SLASHES = /(^\/|\/$)/g;

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
    this.basePath = path.resolve(options.basePath);
    this.sourcePath = path.resolve(this.basePath, options.sourceDir);
    this.outputPath = path.resolve(this.basePath, options.outputDir);
    this.templatesPath = path.resolve(this.sourcePath, options.templatesDir);
    this.assetsPath = path.resolve(this.sourcePath, options.assetsDir);

    this.url = PROTOCOL.test(options.url)
      ? options.url
      : `http://${options.url}`;

    const urlObj = new URL(this.url);

    this.port = urlObj.port ? parseInt(urlObj.port, 10) : 4000;

    if (this.isProduction()) {
      this.origin = urlObj.origin;
      const pathname = urlObj.pathname.replace(LEADING_AND_TRAILING_SLASHES, "");
      this.pathname = pathname ? `/${pathname}` : "";
    } else {
      this.origin = `http://localhost:${this.port}`;
      this.pathname = "";
    }
  }

  /**
   * Get url for the given path.
   * @param  {String} p - The url path to generate.
   * @return {String}
   */
  getUrl(p = "/") {
    const relativeUrl = this.getRelativeUrl(p);

    const cleanRelativeUrl = relativeUrl.replace(LEADING_SLASH, "");

    return cleanRelativeUrl
      ? `${this.origin}/${cleanRelativeUrl}`
      : this.origin;
  }

  /**
   * Get relative url for the given path.
   * @param  {String} p - The url path to generate.
   * @return {String}
   */
  getRelativeUrl(p = "/") {
    const pathPrefix = this.pathname ? `${this.pathname}/` : "/";

    const cleanPath = p.replace(LEADING_SLASH, "");

    return cleanPath ? pathPrefix + cleanPath : pathPrefix;
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
      basePath: process.cwd(),
      sourceDir: "src",
      outputDir: "public",
      templatesDir: "templates",
      assetsDir: "assets",
      defaultTemplate: "post.njk",
      defaultCollectionTemplate: "collection.njk",
      copyFiles: ["images/**", "robot.txt", "**/*.html"],
      postcssPresetEnv: {
        stage: 3,
        preserve: false
      }
    };
  }
}

module.exports = Config;
