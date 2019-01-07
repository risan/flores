const hljs = require("highlight.js");
const markdownIt = require("markdown-it");
const mdAnchor = require("markdown-it-anchor");
const mdToc = require("markdown-it-table-of-contents");

/**
 * Default code highligting function.
 * @param  {String} str  - Code to highlight.
 * @param  {String} lang - Code's language.
 * @return {String}
 */
const highlight = (str, lang) => {
  const { language, value } =
    lang && hljs.getLanguage(lang)
      ? hljs.highlight(lang, str, true)
      : hljs.highlightAuto(str);

  return `<pre><code class="hljs ${language}">${value}</code></pre>`;
};

/**
 * Setup markdown-it instance.
 * @param  {Object} options.options - Markdown it options.
 * @param  {Object} anchor          - markdown-it-anchor plugin options.
 * @param  {Object} toc             - markdown-it-table-of-contents plugin options.
 * @return {MarkdownId}
 */
const setupMarkdownIt = (options = {}, { anchor = {}, toc = {} } = {}) => {
  const md = markdownIt({
    highlight,
    ...options
  });

  md.use(mdAnchor, anchor).use(mdToc, toc);

  return md;
};

module.exports = setupMarkdownIt;
