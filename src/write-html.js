const fs = require("fs-extra");
const minifier = require("html-minifier");
const nunjucks = require("nunjucks");

/**
 * Render template and write it to HTML file.
 * @param  {String} outputPath       - The HTML destination path.
 * @param  {String} options.template - The template path to render.
 * @param  {Object} options.data     - The view data to render.
 * @param  {Boolean} minify          - Set to true to minify the HTML output.
 * @return {Promise}
 */
const writeHtml = (outputPath, { template, data = {}, minify = true }) => {
  let str = nunjucks.render(template, data);

  if (minify) {
    str = minifier.minify(str, {
      collapseWhitespace: true,
      removeComments: true
    });
  }

  return fs.outputFile(outputPath, str);
};

module.exports = writeHtml;
