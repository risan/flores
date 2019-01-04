const fs = require("fs-extra");
const globby = require("globby");
const groupBy = require("lodash.groupby");
const orderBy = require("lodash.orderby");

const getMarkdownOutputInfo = require("./get-markdown-output-info");

/**
 * Parse all markdown files.
 * @param  {Config} options.config - The Config instance.
 * @param  {MarkdownParser} options.markdownParser - The MarkdownParser instance.
 * @return {Object}
 */
const parseMarkdownFiles = async ({ config, markdownParser }) => {
  const files = await globby("**/*.(md|markdown)", {
    cwd: config.sourcePath,
    absolute: true
  });

  const pages = await Promise.all(
    files.map(async file => {
      const source = await fs.readFile(file, "utf8");

      const { frontMatter, html } = markdownParser.parse(source);

      const outputInfo = getMarkdownOutputInfo(file, config);

      return {
        frontMatter,
        content: html,
        ...outputInfo
      };
    })
  );

  const posts = orderBy(
    pages.filter(page => !page.frontMatter.collection),
    "frontMatter.date",
    "desc"
  );

  const collections = groupBy(posts, "collectionName");

  const collectionPages = pages.filter(page => page.frontMatter.collection);

  return {
    posts,
    collections,
    collectionPages
  };
};

module.exports = parseMarkdownFiles;
