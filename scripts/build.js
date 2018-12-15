const path = require("path");

const fs = require("fs-extra");

const Config = require("./config");
const copyStaticFiles = require("./copy-static-files");
const generateSitemap = require("./generate-sitemap");
const processCssFiles = require("./process-css-files");
const processCollectionPages = require("./process-collection-pages");
const processMarkdownFiles = require("./process-markdown-files");
const Renderer = require("./renderer");

const build = async (basePath = process.cwd()) => {
  const config = new Config(basePath);

  console.log(`⏳ Generating website: ${config.outputDir}`);

  const renderer = new Renderer(config);

  await fs.remove(config.outputDir);

  const assets = await processCssFiles(config);

  console.log(`✅ ${Object.keys(assets).length} CSS files are compiled.`);

  renderer.addGlobal("assets", assets);

  const pages = await processMarkdownFiles({ config, renderer });

  const {
    posts, collectionPages
  } = await processCollectionPages(pages, { config, renderer });

  console.log(`✅ ${pages.length} markdown files are converted.`);

  const files = await copyStaticFiles(config);

  console.log(`✅ ${files.length} static files are copied.`);

  await generateSitemap({ config, posts, collectionPages });

  console.log("✅ Sitemap is generated.");

  console.log(`🎉 Build complete!`);

  return { config, renderer };
};

module.exports = build;
