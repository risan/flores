const groupBy = require("lodash.groupBy");
const orderBy = require("lodash.orderBy");

const processCollectionPage = require("./process-collection-page");

/**
 * Process all collection pages.
 * @param  {Array} pages                - Parsed markdown pages data.
 * @param  {Config} options.config      - The Config instance.
 * @param  {Renderer} options.renderer  - The Renderer instance.
 * @return {Object}
 */
const processCollectionPages = async (pages, { config, renderer }) => {
  const collectionPages = pages.filter(page => page.frontMatter.collection);

  const posts = orderBy(
    pages.filter(page => !page.frontMatter.collection),
    "frontMatter.date",
    "desc"
  );

  const collections = groupBy(posts, "collectionName");

  await Promise.all(collectionPages.map(page =>
    processCollectionPage(page, {
      collections,
      config,
      renderer
    })
  ));

  return { posts, collections, collectionPages };
};

module.exports = processCollectionPages;
