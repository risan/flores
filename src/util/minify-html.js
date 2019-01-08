const minifier = require("html-minifier");

/**
 * Minify the HTML.
 * @param  {String} html - The HTML to minify.
 * @return {String}
 */
const minifyHtml = html =>
  minifier.minify(html, {
    collapseWhitespace: true,
    removeComments: true
  });

module.exports = minifyHtml;
