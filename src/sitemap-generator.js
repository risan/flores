const p = require("path");

const get = require("lodash.get");
const has = require("lodash.has");
const sm = require("sitemap");

const writeFile = require("./fs/write-file");

class SitemapGenerator {
  /**
   * Create a new SitemapGenerator instance.
   * @param  {String} options.output - The output path.
   */
  constructor({ output }) {
    this.output = output;
  }

  /**
   * Generate the sitemap.
   * @param  {Array} options.posts - List of posts data.
   * @param  {Array} options.pages - List of pages data.
   * @return {Promise}
   */
  async generate({ posts, pages }) {
    const postUrls = posts.map(post => SitemapGenerator.formatItem(post));

    const pageUrls = pages.map(page =>
      SitemapGenerator.formatItem(page, {
        changefreq: "daily"
      })
    );

    const sitemap = sm.createSitemap({
      urls: [...pageUrls.filter(Boolean), ...postUrls.filter(Boolean)]
    });

    const path = p.join(this.output, "sitemap.xml");

    return writeFile(path, sitemap.toString());
  }

  /**
   * Format page item.
   * @param  {Object} item         - The page data.
   * @param  {Object} defaultValue - The default value to set.
   * @return {Object}
   */
  static formatItem(item, defaultValue = {}) {
    if (get(item, "frontMatter.sitemap") === false) {
      return null;
    }

    const obj = {
      url: item.url,
      ...defaultValue,
      ...get(item, "frontMatter.sitemap", {})
    };

    if (has(item, "frontMatter.modifiedAt")) {
      obj.lastmodISO = item.frontMatter.modifiedAt.toISOString();
    } else if (has(item, "frontMatter.date")) {
      obj.lastmodISO = item.frontMatter.date.toISOString();
    }

    return obj;
  }
}

module.exports = SitemapGenerator;
