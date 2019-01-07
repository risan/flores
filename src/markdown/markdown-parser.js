const fm = require("front-matter");

const readFile = require("../fs/read-file");
const setupMarkdownIt = require("./setup-markdown-it");

class MarkdownParser {
  /**
   * Create new instance of MarkdownParser.
   * @param  {Object} options - Markdown it options.
   */
  constructor(options = {}) {
    this.md = setupMarkdownIt(options);
  }

  /**
   * Parse the given markdown file.
   * @param  {String} path - Markdown file path to parse.
   * @return {Object}
   */
  async parseFile(path) {
    const data = await readFile(path);

    return this.parse(data);
  }

  /**
   * Parse the given markdown data.
   * @param  {String} data - Markdown data to parse.
   * @return {Object}
   */
  parse(data) {
    const { attributes, body } = fm(data);

    return {
      frontMatter: attributes,
      html: this.md.render(body)
    };
  }
}

module.exports = MarkdownParser;
