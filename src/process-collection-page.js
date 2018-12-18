/**
 * Process collection page.
 * @param  {Object} page                - Collection page markdown data.
 * @param  {Object} options.collections - Markdown posts data grouped by collection name.
 * @param  {Config} options.config      - The Config instance.
 * @param  {Renderer} options.renderer  - The Renderer instance.
 * @return {Promise}
 */
const processCollectionPage = async (
  page,
  { collections, config, renderer }
) => {
  const template = page.frontMatter.template
    ? page.frontMatter.template
    : config.defaultCollectionTemplate;

  return renderer.writeHtml(page.outputPath, template, {
    ...page,
    collections,
    collection: collections[page.collectionName]
  });
};

module.exports = processCollectionPage;
