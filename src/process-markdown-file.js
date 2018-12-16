const getOutputInfo = require("./get-output-info");
const parseMarkdownFile = require("./parse-markdown-file");

/**
 * Process the given markdown file.
 * @param  {String} file             - The path to markdown file to process.
 * @param  {Config} options.config   - The Config instance.
 * @param  {Renderer} options.renderer - The Renderer instance.
 * @return {Object}
 */
const processMarkdownFile = async (file, { config, renderer }) => {
  const { frontMatter, html } = await parseMarkdownFile(file);

  const { outputPath, ...outputInfo } = getOutputInfo(file, config);

  if (!frontMatter.collection) {
    const template = frontMatter.template
      ? frontMatter.template
      : config.defaultTemplate;

    await renderer.writeHtml(outputPath, template, {
      ...outputInfo,
      frontMatter,
      content: html
    });
  }

  return { ...outputInfo, outputPath, frontMatter };
};

module.exports = processMarkdownFile;
