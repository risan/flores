const fs = require("fs-extra");

/**
 * Write data to file.
 * @param  {String} path - The file path.
 * @param  {String} data - The data to write.
 * @return {Promise}
 */
const writeFile = (path, data) => fs.outputFile(path, data);

module.exports = writeFile;
