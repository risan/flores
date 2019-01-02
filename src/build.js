/* eslint no-console: "off" */
const fs = require("fs-extra");

const Config = require("./config");
const copyStaticFiles = require("./copy-static-files");
const generateSitemap = require("./generate-sitemap");
const processCssFiles = require("./process-css-files");
const processMarkdownFiles = require("./process-markdown-files");
const Renderer = require("./renderer");

/**
 * Build the site.
 * @param  {Object} options - The site configuration options.
 * @return {Object}
 */
const build = async (options = {}) => {
  const config = new Config(options);

  console.log(`⏳ Generating website to: ${config.outputPath}`);

  const renderer = new Renderer(config);

  await fs.remove(config.outputPath);

  const assets = await processCssFiles(config);

  console.log(`✅ ${Object.keys(assets).length} CSS files are compiled.`);

  renderer.addGlobal("assets", assets);

  const { posts, collectionPages } = await processMarkdownFiles({
    config,
    renderer
  });

  console.log(`✅ ${posts.length} markdown posts are converted.`);
  console.log(`✅ ${collectionPages.length} collection pages are generated.`);

  const files = await copyStaticFiles(config);

  console.log(`✅ ${files.length} static files are copied.`);

  await generateSitemap({ config, posts, collectionPages });

  console.log("✅ Sitemap is generated.");

  console.log(`🎉 Build complete!`);

  return { config, renderer };
};

module.exports = build;
