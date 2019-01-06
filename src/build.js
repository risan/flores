/* eslint no-console: "off" */
const fs = require("fs-extra");

const Config = require("./config");
const generateSitemap = require("./generate-sitemap");
const MarkdownParser = require("./markdown-parser");
const processCssFiles = require("./process-css-files");
const processMarkdownFiles = require("./process-markdown-files");
const Renderer = require("./renderer");
const StaticFileProcessor = require("./static-file-processor");

/**
 * Build the site.
 * @param  {Object} options - The site configuration options.
 * @return {Object}
 */
const build = async (options = {}) => {
  const config = new Config(options);

  console.log(`⏳ Generating website to: ${config.outputPath}`);

  const markdownParser = new MarkdownParser({
    anchor: config.markdownAnchor,
    toc: config.markdownToc
  });

  const renderer = new Renderer(config);

  const staticFileProcessor = new StaticFileProcessor({
    patterns: config.copyFiles,
    source: config.sourcePath,
    destination: config.outputPath
  });

  await fs.remove(config.outputPath);

  const assets = await processCssFiles(config);

  console.log(`✅ ${Object.keys(assets).length} CSS files are compiled.`);

  renderer.addGlobal("assets", assets);

  const { posts, collectionPages } = await processMarkdownFiles({
    config,
    markdownParser,
    renderer
  });

  console.log(`✅ ${posts.length} markdown posts are converted.`);
  console.log(`✅ ${collectionPages.length} collection pages are generated.`);

  const files = await staticFileProcessor.copyAll();

  console.log(`✅ ${files.length} static files are copied.`);

  await generateSitemap({ config, posts, collectionPages });

  console.log("✅ Sitemap is generated.");

  console.log(`🎉 Build complete!`);

  return { config, markdownParser, renderer };
};

module.exports = build;
