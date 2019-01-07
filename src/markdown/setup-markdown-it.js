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
 * @param  {Object}    options.anchor - markdown-it-anchor plugin options.
 * @param  {Object}    toc            - markdown-it-table-of-contents plugin options.
 * @param  {Object} options           - markdown-it options.
 * @return {MarkdownIt}
 */
const setupMarkdownIt = ({ anchor = {}, toc = {}, ...options } = {}) => {
  const md = markdownIt({
    highlight,
    ...options
  });

  md.use(mdAnchor, anchor).use(mdToc, toc);

  return md;
};

module.exports = setupMarkdownIt;
