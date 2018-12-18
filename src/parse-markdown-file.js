const fm = require("front-matter");
const fs = require("fs-extra");
const md = require("markdown-it")();
const mdAnchor = require("markdown-it-anchor");
const mdToc = require("markdown-it-table-of-contents");

md.use(mdAnchor, { permalink: true, permalinkBefore: true }).use(mdToc, {
  containerHeaderHtml: "<h2>Table of Contents</h2>",
  includeLevel: [2, 3, 4, 5]
});

/**
 * Parse markdown file.
 * @param  {String} path - The markdown file path to parse.
 * @return {Object} Return the frontMatter and the rendered HTML.
 */
const parseMarkdownFile = async path => {
  const source = await fs.readFile(path, "utf8");

  const { attributes, body } = fm(source);

  return {
    frontMatter: attributes,
    html: md.render(body)
  };
};

module.exports = parseMarkdownFile;
