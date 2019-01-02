const globby = require("globby");
const groupBy = require("lodash.groupby");
const orderBy = require("lodash.orderby");

const parseMarkdownFile = require("./parse-markdown-file");

/**
 * Parse all markdown files.
 * @param  {Config} config - The Config instance.
 * @return {Object}
 */
const parseMarkdownFiles = async config => {
  const files = await globby("**/*.(md|markdown)", {
    cwd: config.sourcePath,
    absolute: true
  });

  const pages = await Promise.all(
    files.map(file => parseMarkdownFile(file, config))
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
