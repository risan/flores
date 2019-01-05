const fs = require("fs-extra");

/**
 * Copy the given source to destination.
 * @param  {String} source      - File path to copy.
 * @param  {String} destination - The destination path.
 * @return {Promise}
 */
const copyFile = (source, destination) => fs.copy(source, destination);

module.exports = copyFile;
