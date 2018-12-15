const path = require("path");

const chokidar = require("chokidar");
const debounce = require("lodash.debounce");
const fs = require("fs-extra");
const mm = require("micromatch");

const build = require("./build");
const Config = require("./config");
const generateSitemap = require("./generate-sitemap");
const processCssFiles = require("./process-css-files");
const processCollectionPages = require("./process-collection-pages");
const processMarkdownFiles = require("./process-markdown-files");

const EVENTS_TO_CATCH = ["change", "add", "unlink"];

const CSS_FILE = "css";
const MARKDOWN_FILE = "markdown";
const TEMPLATE_FILE = "template";
const STATIC_FILE = "static";

const CSS_EXTENSION = ".css";
const MARKDOWN_EXTENSIONS = [".md", ".markdown"];
const TEMPLATE_EXTENSIONS = [".html", ".njs"];

const watch = async (basePath = process.cwd()) => {
  const { config, renderer } = await build(basePath);

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
   * Get event message for logging.
   * @param  {String} options.event    - The event type.
   * @param  {String} options.p        - The file path.
   * @param  {String} options.fileType - The file type.
   * @return {String}
   */
  const getEventMessage = ({ event, p, fileType }) => {
    switch (event) {
      case "change":
        return `✏️ ${fileType} file is updated: ${p}`;
      case "add":
        return `✨ New ${fileType} file: ${p}`;
      case "unlink":
        return `🔥 ${fileType} is deleted: ${p}`;
    };
  };

  /**
   * Handle css file change.
   * @return {Promise}
   */
  const handleCssChange = async () => {
    const assets = await processCssFiles(config);

    console.log(`✅ ${Object.keys(assets).length} CSS files are compiled.`);

    renderer.addGlobal("assets", assets);

    await handleMarkdownOrTemplateChange();
  };

  /**
   * Handle markdown or template change.
   * @return {Promise}
   */
  const handleMarkdownOrTemplateChange = async () => {
    const pages = await processMarkdownFiles({ config, renderer });

    const {
      posts, collectionPages
    } = await processCollectionPages(pages, { config, renderer });

    console.log(`✅ ${pages.length} markdown files are converted.`);

    await generateSitemap({ config, posts, collectionPages });

    console.log("✅ Sitemap is generated.");
  };

  /**
   * Handle static file change.
   * @param  {String} options.event - The event type.
   * @param  {String} options.p     - The file path.
   * @return {Promise}
   */
  const handleStaticFileChange = async ({ event, p }) => {
    if (["change", "add"].includes(event)) {
      await fs.copy(
        path.join(config.sourceDir, p),
        path.join(config.outputDir, p)
      );
    } else if (event === "unlink") {
      await fs.remove(path.join(config.outputDir, p));
    }
  };

  const handleCssChangeDebounced = debounce(handleCssChange, 1000);
  const handleMarkdownOrTemplateChangeDebounced = debounce(handleMarkdownOrTemplateChange, 1000);

  const watcher = chokidar.watch(".", {
    ignored: /(^|[\/\\])\../,
    ignoreInitial: true,
    cwd: config.sourceDir
  });

  watcher.on("ready", () => console.log("👀 watcher is ready..."));

  watcher.on("all", async (event, p) => {
    if (!EVENTS_TO_CATCH.includes(event)) {
      return;
    }

    const fileType = getFileType(p);

    if (fileType === null) {
      return;
    }

    console.log(getEventMessage({ event, p, fileType }));

    if (fileType === CSS_FILE) {
      await handleCssChangeDebounced();
    } else if ([MARKDOWN_FILE, TEMPLATE_FILE].includes(fileType)) {
      await handleMarkdownOrTemplateChangeDebounced();
    } else {
      await handleStaticFileChange({ event, p });
    }
  });
};

module.exports = watch;
