const parseMarkdownFiles = require("./parse-markdown-files");

/**
 * Write the page.
 * @param  {Object} page             - The page data.
 * @param  {Config} options.config   - The Config instance.
 * @param  {Renderer} options.renderer - The Renderer instance.
 * @param  {Object} options.data     - All website pages data.
 * @return {Promise}
 */
const writePage = async (page, { config, renderer, data }) => {
  const defaultTemplate = page.frontMatter.collection
    ? config.defaultCollectionTemplate
    : config.defaultTemplate;

  const template = page.frontMatter.template
    ? page.frontMatter.template
    : defaultTemplate;

  return renderer.writeHtml(page.outputPath, template, {
    ...data,
    ...page,
    collection: data.collections[page.collectionName]
  });
};

/**
 * Process all markdown files.
 * @param  {Config} options.config   - The Config instance.
 * @param  {Renderer} options.renderer - The Renderer instance.
 * @return {Object}
 */
const processMarkdownFiles = async ({ config, renderer }) => {
  const data = await parseMarkdownFiles(config);

  await Promise.all(
    data.posts.map(page =>
      writePage(page, {
        config,
        renderer,
        data
      })
    )
  );

  await Promise.all(
    data.collectionPages.map(page =>
      writePage(page, {
        config,
        renderer,
        data
      })
    )
  );

  return data;
};

module.exports = processMarkdownFiles;
