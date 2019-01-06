const fs = require("fs");
const util = require("util");

const fsReadFile = util.promisify(fs.readFile);

/**
 * Read the given file page.
 * @param  {String} path            - The file path to read.
 * @param  {String|Object} options  - The read options.
 * @return {Promise}
 */
const readFile = (path, options = "utf8") => fsReadFile(path, options);

module.exports = readFile;
