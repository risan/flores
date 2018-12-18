const path = require("path");
const { URL } = require("url");

const PROTOCOL = /^http[s]?:\/\//i;
const LEADING_SLASH = /^\//;
const LEADING_AND_TRAILING_SLASHES = /(^\/|\/$)/g;

class Config {
  /**
   * Create new config instance.
   * @param  {String} options.basePath - The site base path.
   * @param  {Object} options.data     - The config data.
   */
  constructor({ basePath = process.cwd(), ...data } = {}) {
    this.basePath = basePath;

    this.data = this.formatData({
      ...Config.defaultData,
      ...data
    });

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
      ? `${this.data.origin}/${cleanRelativeUrl}`
      : this.data.origin;
  }

  /**
   * Get relative url for the given path.
   * @param  {String} p - The url path to generate.
   * @return {String}
   */
  getRelativeUrl(p = "/") {
    const pathPrefix = this.data.pathname ? `${this.data.pathname}/` : "/";

    const cleanPath = p.replace(LEADING_SLASH, "");

    return cleanPath ? pathPrefix + cleanPath : pathPrefix;
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
    const sourceDir = this.resolvePath(data.sourceDir);
    const outputDir = this.resolvePath(data.outputDir);
    const templatesDir = path.resolve(sourceDir, data.templatesDir);
    const assetsDir = path.resolve(sourceDir, data.assetsDir);

    const url = PROTOCOL.test(data.url) ? data.url : `http://${data.url}`;

    let { origin, port, pathname } = new URL(url);

    port = port ? parseInt(port, 10) : 4000;

    if (data.env.toLowerCase() === "production") {
      pathname = pathname.replace(LEADING_AND_TRAILING_SLASHES, "");

      if (pathname) {
        pathname = `/${pathname}`;
      }
    } else {
      origin = `http://localhost:${port}`;
      pathname = "";
    }

    return {
      ...data,
      sourceDir,
      outputDir,
      templatesDir,
      assetsDir,
      url,
      origin,
      port,
      pathname
    };
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
      copyFiles: ["images/**", "robot.txt", "**/*.html"],
      postcssPresetEnv: {
        stage: 3,
        preserve: false
      }
    };
  }
}

module.exports = Config;
