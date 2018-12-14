#!/usr/bin/env node
const path = require("path");

const fs = require("fs-extra");

const Config = require("./config");
const copyStaticFiles = require("./copy-static-files");
const generateSitemap = require("./generate-sitemap");
const processCssFiles = require("./process-css-files");
const processCollectionPages = require("./process-collection-pages");
const processMarkdownFiles = require("./process-markdown-files");
const Renderer = require("./renderer");

(async () => {
  const basePath = process.cwd();

  const config = new Config(basePath);

  const renderer = new Renderer(config);

  await fs.remove(config.outputDir);

  const assets = await processCssFiles(config);

  renderer.addGlobal("assets", assets);

  const pages = await processMarkdownFiles({ config, renderer });

  const {
    posts, collections, collectionPages
  } = await processCollectionPages(pages, { config, renderer });

  await copyStaticFiles(config);

  await generateSitemap({ config, posts, collectionPages });
})();
