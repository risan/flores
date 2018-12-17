const path = require("path");
const { URL } = require("url");

const PROTOCOL = /^http[s]?:\/\//i;
const LEADING_SLASH = /^\//;
const LEADING_AND_TRAILING_SLASHES = /(^\/|\/$)/g;

class Config {
  /**
   * Create new config instance.
   * @param  {String} basePath - The site base path.
   */
  constructor(basePath) {
    this.basePath = basePath;

    this.data = this.formatData(
      this.loadDataFromFile()
    );

    return new Proxy(this, {
      get(config, prop) {
        return prop in config ? config[prop] : config.data[prop];
      }
    });
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
      ? `${this.data.url}/${cleanRelativeUrl}`
      : this.data.url;
  }

  /**
   * Get relative url for the given path.
   * @param  {String} p - The url path to generate.
   * @return {String}
   */
  getRelativeUrl(p = "/") {
    const baseUrl = this.data.pathPrefix ? `${this.data.pathPrefix}/` : "/";

    const cleanPath = p.replace(LEADING_SLASH, "");

    return cleanPath ? baseUrl + cleanPath : baseUrl;
  }

  /**
   * Check if it's a production environment.
   * @return {Boolean}
   */
  isProduction() {
    return this.data.env.toLowerCase() === "production";
  }

  /**
   * Format the config data.
   * @param  {Object} data - The config data.
   * @return {Object} The formatted config data.
   */
  formatData(data) {
    // Directories.
    data.sourceDir = this.resolvePath(data.sourceDir);
    data.outputDir = this.resolvePath(data.outputDir);
    data.templatesDir = path.resolve(data.sourceDir, data.templatesDir);
    data.assetsDir = path.resolve(data.sourceDir, data.assetsDir);

    if (!PROTOCOL.test(data.url)) {
      data.url = `http://${data.url}`;
    }

    const { origin, port, pathname } = new URL(data.url);

    data.port = port ? parseInt(port, 10) : 4000;

    if (data.env.toLowerCase() === "production") {
      data.url = origin;
      data.pathPrefix = pathname.replace(LEADING_AND_TRAILING_SLASHES, "");

      if (data.pathPrefix) {
        data.pathPrefix = `/${data.pathPrefix}`;
      }
    } else {
      // Override url value for development.
      data.url = `http://localhost:${port}`;
      data.pathPrefix = "";
    }

    return data;
  }

  /**
   * Resolve the given path.
   * @param  {String} p - The path to resolve.
   * @return {String} The resolved path.
   */
  resolvePath(p) {
    if (path.isAbsolute(p)) {
      return p;
    }

    return path.resolve(this.basePath, p);
  }

  /**
   * Load config data from file.
   * @return {Object} The config data.
   */
  loadDataFromFile() {
    let data = {};

    try {
      const configFile = path.resolve(this.basePath, "site.config.js");

      data = require(configFile);
    } catch(error) {
      //
    }

    return { ...Config.defaultData, ...data };
  }

  /**
   * Default config data.
   * @return {Object}
   */
  static get defaultData() {
    return {
      env: process.env.NODE_ENV ? process.env.NODE_ENV : "production",
      url: "http://localhost:4000",
      sourceDir: "src",
      outputDir: "public",
      templatesDir: "templates",
      assetsDir: "assets",
      defaultTemplate: "post.html",
      defaultCollectionTemplate: "collection.html",
      copyFiles: [
        "images/**",
        "robot.txt",
        "**/*.html"
      ],
      postcssPresetEnv: {
        stage: 3,
        preserve: false
      }
    };
  }
}

module.exports = Config;
