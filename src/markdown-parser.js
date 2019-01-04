const fm = require("front-matter");
const hljs = require("highlight.js");
const markdownIt = require("markdown-it");
const mdAnchor = require("markdown-it-anchor");
const mdToc = require("markdown-it-table-of-contents");

class MarkdownParser {
  /**
   * Create new MarkdownParser instance.
   * @param  {Object} options.anchor - The anchor plugin options.
   * @param  {Object} options.toc    - The TOC plugin options.
   * @return {MarkdownParser}
   */
  constructor({ anchor = {}, toc = {} } = {}) {
    this.md = MarkdownParser.createMd({ anchor, toc });
  }

  /**
   * Create markdown-it instance.
   * @param  {Object} options.anchor - The anchor plugin options.
   * @param  {Object} options.toc    - The TOC plugin options.
   * @return {MarkdownIt}
   */
  static createMd({ anchor = {}, toc = {} } = {}) {
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

    md.use(mdAnchor, anchor).use(mdToc, toc);

    return md;
  }

  /**
   * Parse markdown string.
   * @param  {String} markdown - Markdown string to parse.
   * @return {Object}
   */
  parse(markdown) {
    const { attributes, body } = fm(markdown);

    return {
      frontMatter: attributes,
      html: this.md.render(body)
    };
  }
}

module.exports = MarkdownParser;
