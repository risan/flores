const { URL } = require("url");

const LEADING_SLASH = /^\//;
const TRAILING_SLASH = /\/$/;

class UrlGenerator {
  /**
   * Create new UrlGenerator instance.
   * @param  {URL|String} url - The base url.
   */
  constructor(url) {
    this.url = url instanceof URL ? url : new URL(url);
  }

  /**
   * Get absolute url for the given path.
   * @param  {String} path - The url path to generate.
   * @return {String}
   */
  to(path = "/") {
    const relativeUrl = this.relative(path);

    return this.url.origin + relativeUrl;
  }

  /**
   * Get relative url for the given path.
   * @param  {String} path - The url path to generate.
   * @return {String}
   */
  relative(path = "/") {
    const cleanPath = path.replace(LEADING_SLASH, "");

    return TRAILING_SLASH.test(this.url.pathname)
      ? this.url.pathname + cleanPath
      : `${this.url.pathname}/${cleanPath}`;
  }

  /**
   * Get base url as a string.
   * @return {String}
   */
  toString() {
    return this.url.toString();
  }
}

module.exports = UrlGenerator;
