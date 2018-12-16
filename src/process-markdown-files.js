const globby = require("globby");
const processMarkdownFile = require("./process-markdown-file");

/**
 * Process all markdown files.
 * @param  {Config} options.config   - The Config instance.
 * @param  {Renderer} options.renderer - The Renderer instance.
 * @return {Array}
 */
const processMarkdownFiles = async ({ config, renderer }) => {
  const files = await globby("**/*.(md|markdown)", {
    cwd: config.sourceDir,
    absolute: true
  });

  const data = await Promise.all(
    files.map(file => processMarkdownFile(file, { config, renderer }))
  );

  return data;
};

module.exports = processMarkdownFiles;
