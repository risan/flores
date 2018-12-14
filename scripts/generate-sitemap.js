const path = require("path");

const fs = require("fs-extra");
const get = require("lodash.get");
const has = require("lodash.has");
const sm = require("sitemap");

/**
 * Format site map item.
 * @param  {Object} page         - The markdown page data.
 * @param  {Object} defaultValue - The default value for site map item.
 * @return {Object|Null}
 */
const formatSiteMapItem = (page, defaultValue = {}) => {
  if (get(page, "frontMatter.sitemap") === false) {
    return null;
  }

  let obj = {
    url: page.url,
    ...defaultValue,
    ...get(page, "frontMatter.sitemap", {}),
  };

  if (has(page, "frontMatter.modifiedAt")) {
    obj.lastmodISO = page.frontMatter.modifiedAt.toISOString();
  } else if(has(page, "frontMatter.date")) {
    obj.lastmodISO = page.frontMatter.date.toISOString();
  }

  return obj;
};

/**
 * Generate sitemap.
 * @param  {Array} options.posts           - Array of markdown posts data.
 * @param  {Array} options.collectionPages - Array of markdown collection pages data.
 * @param  {Config} options.config         - The Config instance.
 * @return {Promise}
 */
const generateSitemap = async ({ posts, collectionPages, config }) => {
  const postUrls = posts.map(post => formatSiteMapItem(post));
  const collectionPageUrls = collectionPages.map(
    page => formatSiteMapItem(page, {
      changefreq: "daily"
    })
  );

  const sitemap = sm.createSitemap({
    hostname: config.url,
    urls: [
      ...collectionPageUrls.filter(Boolean),
      ...postUrls.filter(Boolean)
    ]
  });

  const outputPath = path.join(config.outputDir, "sitemap.xml");

  return await fs.outputFile(outputPath, sitemap.toString());
};

module.exports = generateSitemap;
