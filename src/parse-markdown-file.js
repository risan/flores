const fm = require("front-matter");
const fs = require("fs-extra");
const hljs = require("highlight.js");
const markdownIt = require("markdown-it");
const mdAnchor = require("markdown-it-anchor");
const mdToc = require("markdown-it-table-of-contents");

const getMarkdownOutputInfo = require("./get-markdown-output-info");

const md = markdownIt({
  highlight: (str, lang) => {
    let result;

    if (lang && hljs.getLanguage(lang)) {
      result = hljs.highlight(lang, str, true);
    } else {
      result = hljs.highlightAuto(str);
    }

    return `<pre><code class="hljs ${result.language}">${
      result.value
    }</code></pre>`;
  }
});

md.use(mdAnchor, { permalink: true, permalinkBefore: true }).use(mdToc, {
  containerHeaderHtml: "<h2>Table of Contents</h2>",
  includeLevel: [2, 3, 4, 5]
});

/**
 * Parse markdown file.
 * @param  {String} path - The markdown file path to parse.
 * @param  {Object} config - The Config instance.
 * @return {Object} Return the frontMatter, the rendered HTML, and output info.
 */
const parseMarkdownFile = async (path, config) => {
  const source = await fs.readFile(path, "utf8");

  const { attributes, body } = fm(source);

  const outputInfo = getMarkdownOutputInfo(path, config);

  return {
    frontMatter: attributes,
    content: md.render(body),
    ...outputInfo
  };
};

module.exports = parseMarkdownFile;
