const path = require("path");

const chokidar = require("chokidar");
const debounce = require("lodash.debounce");
const fs = require("fs-extra");
const mm = require("micromatch");

const build = require("./build");
const generateSitemap = require("./generate-sitemap");
const processCssFiles = require("./process-css-files");
const processCollectionPages = require("./process-collection-pages");
const processMarkdownFiles = require("./process-markdown-files");
const runServer = require("./run-server");

const CSS_FILE = "css";
const MARKDOWN_FILE = "markdown";
const TEMPLATE_FILE = "template";
const STATIC_FILE = "static";

const CSS_EXTENSION = ".css";
const MARKDOWN_EXTENSIONS = [".md", ".markdown"];
const TEMPLATE_EXTENSIONS = [".html", ".njs"];

/**
 * Run the file watcher.
 * @param  {Object} options - The configuration data.
 * @return {Promise}
 */
const watch = async (options = {}) => {
  const { config, renderer } = await build({
    ...options,
    env: "development",
    watch: true
  });

  const { socketIo } = await runServer({
    publicDir: config.outputDir,
    port: config.port,
    watch: true
  });

  /**
   * Reload the browser.
   * @return {Void}
   */
  const reloadBrowser = () => socketIo.emit("flores.reloadBrowser");

  const assetsPath = path.relative(config.sourceDir, config.assetsDir) + "/";
  const templatesPath = path.relative(config.sourceDir, config.templatesDir) + "/";

  /**
   * Get file type for the given path.
   * @param  {String} p - File path to detect.
   * @return {String|Null}
   */
  const getFileType = p => {
    const { ext } = path.parse(p);

    const extension = ext.toLowerCase();

    if (extension === CSS_EXTENSION && p.startsWith(assetsPath)) {
      return CSS_FILE;
    }

    if (MARKDOWN_EXTENSIONS.includes(extension)) {
      return MARKDOWN_FILE;
    }

    if (TEMPLATE_EXTENSIONS.includes(extension) && p.startsWith(templatesPath)) {
      return TEMPLATE_FILE;
    }

    if (mm.any(p, config.copyFiles)) {
      return STATIC_FILE;
    }

    return null;
  };

  /**
   * Process css files.
   * @param  {Boolean} options.reprocessMarkdown - Set to true to reprocess the markdown files to.
   * @return {Promise}
   */
  const processCss = async ({ reprocessMarkdown = false } = {}) => {
    const assets = await processCssFiles(config);

    console.log(`✅ ${Object.keys(assets).length} CSS files are compiled.`);

    renderer.addGlobal("assets", assets);

    if (reprocessMarkdown) {
      await processMarkdown();
    } else {
      reloadBrowser();
    }
  };

  /**
   * Process markdown files.
   * @param  {Boolean} options.clearCache - Set to true to clear the compiled template caches.
   * @return {Promise}
   */
  const processMarkdown = async ({ clearCache = false } = {}) => {
    if (clearCache) {
      renderer.clearCache();
    }

    const pages = await processMarkdownFiles({ config, renderer });

    const {
      posts, collectionPages
    } = await processCollectionPages(pages, { config, renderer });

    console.log(`✅ ${pages.length} markdown files are converted.`);

    await generateSitemap({ config, posts, collectionPages });

    console.log("✅ Sitemap is generated.");

    reloadBrowser();
  };

  /**
   * Copy file to output directory.
   * @param  {String} p - The file path to copy.
   * @return {Promise}
   */
  const copyFile = async p => fs.copy(
    path.join(config.sourceDir, p),
    path.join(config.outputDir, p)
  );

  /**
   * Remove file from the output directory.
   * @param  {String} p - The file path to remove.
   * @return {Promise}
   */
  const removeFile = async p => fs.remove(path.join(config.outputDir, p));

  const processCssDebounced = debounce(processCss, 500);
  const processMarkdownDebounced = debounce(processMarkdown, 500);

  const watcher = chokidar.watch(".", {
    ignored: /(^|[\/\\])\../,
    ignoreInitial: true,
    cwd: config.sourceDir
  });

  watcher.on("ready", () => console.log("👀 watcher is ready..."));

  watcher.on("change", async p => {
    const fileType = getFileType(p);

    if (fileType === null) {
      return;
    }

    console.log(`✏️ ${fileType} file is updated: ${p}`);

    if (fileType === CSS_FILE) {
      processCssDebounced();
    } else if (fileType === MARKDOWN_FILE) {
      await processMarkdown();
    } else if (fileType === TEMPLATE_FILE) {
      processMarkdownDebounced({ clearCache: true });
    } else {
      await copyFile(p);
    }
  });

  watcher.on("add", async p => {
    const fileType = getFileType(p);

    if (fileType === null) {
      return;
    }

    console.log(`✨ New ${fileType} file: ${p}`);

    if (fileType === CSS_FILE) {
      processCssDebounced({ reprocessMarkdown: true });
    } else if ([MARKDOWN_FILE, TEMPLATE_FILE].includes(fileType)) {
      processMarkdownDebounced();
    } else {
      await copyFile(p);
    }
  });

  watcher.on("unlink", async p => {
    const fileType = getFileType(p);

    if (fileType === null) {
      return;
    }

    console.log(`🔥 ${fileType} is deleted: ${p}`);

    if (fileType === CSS_FILE) {
      processCssDebounced({ reprocessMarkdown: true });
    } else if ([MARKDOWN_FILE, TEMPLATE_FILE].includes(fileType)) {
      processMarkdownDebounced();
    } else {
      await removeFile(p);
    }
  });
};

module.exports = watch;
